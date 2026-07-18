<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHouseRequest;
use App\Http\Requests\UpdateHouseRequest;
use App\Http\Resources\HouseResidentHistoryResource;
use App\Http\Resources\HouseResource;
use App\Models\House;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $houses = House::query()
            ->with('currentResident')
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->when($request->filled('house_type'), fn($q) => $q->where('house_type', $request->house_type))
            ->orderBy('house_number')
            ->paginate($request->integer('per_page', 15));

        return response()->json(HouseResource::collection($houses)->response()->getData(true));
    }

    public function store(StoreHouseRequest $request): JsonResponse
    {
        $data = $request->validated();

        $house = House::query()->create($data);

        if ($house->status === 'dihuni' && $house->current_resident_id) {
            $house->histories()->create([
                'resident_id' => $house->current_resident_id,
                'start_date' => now()->toDateString(),
            ]);
        }

        return response()->json(new HouseResource($house->load('currentResident')), 201);
    }

    public function show(House $house): JsonResponse
    {
        return response()->json(new HouseResource($house->load('currentResident', 'histories.resident')));
    }

    public function update(UpdateHouseRequest $request, House $house): JsonResponse
    {
        $data = $request->validated();
        $previousResidentId = $house->current_resident_id;
        $previousStatus = $house->status;

        $house->update($data);
        $house->refresh();

        $residentChanged = array_key_exists('current_resident_id', $data)
            && $data['current_resident_id'] != $previousResidentId;
        $becameOccupied = $house->status === 'dihuni' && $previousStatus !== 'dihuni';

        // Jika penghuni berganti, atau rumah baru saja jadi "dihuni": tutup riwayat lama, buka baru
        if (($residentChanged || $becameOccupied) && $house->current_resident_id) {
            $house->histories()
                ->whereNull('end_date')
                ->update(['end_date' => now()->toDateString()]);

            $house->histories()->create([
                'resident_id' => $house->current_resident_id,
                'start_date' => now()->toDateString(),
            ]);
        }

        // Jika rumah jadi "tidak_dihuni": tutup riwayat yang masih terbuka
        if ($house->status === 'tidak_dihuni' && $previousStatus === 'dihuni') {
            $house->histories()
                ->whereNull('end_date')
                ->update(['end_date' => now()->toDateString()]);
        }

        return response()->json(new HouseResource($house->load('currentResident')));
    }

    public function histories(House $house): JsonResponse
    {
        $histories = $house->histories()->with('resident')->get();

        return response()->json(HouseResidentHistoryResource::collection($histories));
    }

    /**
     * Riwayat tagihan/pembayaran untuk satu rumah: siapa penghuni yang wajib
     * membayar, jenis iuran apa, periode kapan, dan statusnya lunas/belum.
     * Sumber datanya tabel billing_periods (tagihan yang sudah di-generate
     * lewat `php artisan billing:generate` atau otomatis via scheduler).
     */
    public function billingHistory(House $house): JsonResponse
    {
        $billingPeriods = $house->billingPeriods()
            ->with(['resident', 'dueType'])
            ->orderByDesc('period_year')
            ->orderByDesc('period_month')
            ->get()
            ->map(fn($billing) => [
                'id' => $billing->id,
                'resident' => $billing->resident?->name,
                'due_type' => $billing->dueType?->name,
                'period_month' => $billing->period_month,
                'period_year' => $billing->period_year,
                'amount' => (float) $billing->amount,
                'status' => $billing->status,
            ]);

        return response()->json($billingPeriods);
    }
}
