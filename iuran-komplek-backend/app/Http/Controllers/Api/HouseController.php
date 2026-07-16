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
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('house_type'), fn ($q) => $q->where('house_type', $request->house_type))
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

    public function destroy(House $house): JsonResponse
    {
        $house->delete();

        return response()->json(['message' => 'Rumah berhasil dihapus.']);
    }

    public function histories(House $house): JsonResponse
    {
        $histories = $house->histories()->with('resident')->get();

        return response()->json(HouseResidentHistoryResource::collection($histories));
    }
}
