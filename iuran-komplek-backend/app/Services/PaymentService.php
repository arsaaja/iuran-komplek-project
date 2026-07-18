<?php

namespace App\Services;

use App\Models\BillingPeriod;
use App\Models\DueType;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * Membuat satu transaksi pembayaran yang bisa mencakup
     * beberapa jenis iuran & beberapa bulan sekaligus (mis. bayar 1 tahun).
     *
     * @param  array{resident_id:int, house_id:int, payment_date:string, note?:string, items:array}  $data
     */
    public function store(array $data, ?int $userId = null): Payment
    {
        return DB::transaction(function () use ($data, $userId) {
            $dueTypes = DueType::query()->whereIn('id', collect($data['items'])->pluck('due_type_id'))->get()->keyBy('id');

            $totalAmount = collect($data['items'])->sum(function ($item) use ($dueTypes) {
                return (float) $dueTypes[$item['due_type_id']]->amount;
            });

            $payment = Payment::query()->create([
                'resident_id' => $data['resident_id'],
                'house_id' => $data['house_id'],
                'payment_date' => $data['payment_date'],
                'total_amount' => $totalAmount,
                'note' => $data['note'] ?? null,
                'created_by' => $userId,
            ]);

            foreach ($data['items'] as $item) {
                $dueType = $dueTypes[$item['due_type_id']];

                $paymentItem = $payment->items()->create([
                    'due_type_id' => $dueType->id,
                    'period_month' => $item['period_month'],
                    'period_year' => $item['period_year'],
                    'amount' => $dueType->amount,
                    'status' => 'lunas',
                ]);

                // Tandai tagihan (billing_periods) terkait jadi lunas.
                // Pakai updateOrCreate (bukan cuma update) supaya kalau baris
                // tagihannya belum pernah di-generate lewat billing:generate,
                // tetap otomatis dibuatkan di sini saat ada pembayaran masuk -
                // jadi selalu muncul di Riwayat Pembayaran Rumah.
                BillingPeriod::query()->updateOrCreate(
                    [
                        'house_id' => $data['house_id'],
                        'due_type_id' => $dueType->id,
                        'period_month' => $item['period_month'],
                        'period_year' => $item['period_year'],
                    ],
                    [
                        'resident_id' => $data['resident_id'],
                        'amount' => $dueType->amount,
                        'status' => 'lunas',
                        'payment_item_id' => $paymentItem->id,
                    ]
                );
            }

            return $payment->load('items.dueType');
        });
    }
}
