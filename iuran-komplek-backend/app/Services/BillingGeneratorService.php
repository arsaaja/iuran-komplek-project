<?php

namespace App\Services;

use App\Models\BillingPeriod;
use App\Models\DueType;
use App\Models\House;

class BillingGeneratorService
{
    /**
     * Membuat tagihan (billing_periods) untuk bulan & tahun tertentu.
     * Hanya rumah dengan status "dihuni" yang ditagih.
     * Rumah kontrak yang kosong otomatis dilewati.
     */
    public function generate(int $month, int $year): int
    {
        $dueTypes = DueType::query()->where('is_active', true)->get();
        $houses = House::query()->where('status', 'dihuni')->whereNotNull('current_resident_id')->get();

        $created = 0;

        foreach ($houses as $house) {
            foreach ($dueTypes as $dueType) {
                $billing = BillingPeriod::query()->firstOrCreate(
                    [
                        'house_id' => $house->id,
                        'due_type_id' => $dueType->id,
                        'period_month' => $month,
                        'period_year' => $year,
                    ],
                    [
                        'resident_id' => $house->current_resident_id,
                        'amount' => $dueType->amount,
                        'status' => 'belum',
                    ]
                );

                if ($billing->wasRecentlyCreated) {
                    $created++;
                }
            }
        }

        return $created;
    }
}
