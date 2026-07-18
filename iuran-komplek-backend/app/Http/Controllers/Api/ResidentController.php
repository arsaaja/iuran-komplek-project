<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;
use App\Http\Resources\ResidentResource;
use App\Models\Resident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResidentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $residents = Resident::query()
            ->with('currentHouse')
            ->when($request->filled('resident_type'), fn($q) => $q->where('resident_type', $request->resident_type))
            ->when($request->filled('search'), fn($q) => $q->where('name', 'like', '%' . $request->search . '%'))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 15));

        return response()->json(ResidentResource::collection($residents)->response()->getData(true));
    }

    public function store(StoreResidentRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('ktp_photo')) {
            $data['ktp_photo_path'] = $request->file('ktp_photo')->store('ktp', 'public');
        }

        $resident = Resident::query()->create($data);

        return response()->json(new ResidentResource($resident), 201);
    }

    public function show(Resident $resident): JsonResponse
    {
        return response()->json(new ResidentResource($resident->load('currentHouse', 'histories')));
    }

    public function update(UpdateResidentRequest $request, Resident $resident): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('ktp_photo')) {
            if ($resident->ktp_photo_path) {
                Storage::disk('public')->delete($resident->ktp_photo_path);
            }
            $data['ktp_photo_path'] = $request->file('ktp_photo')->store('ktp', 'public');
        }

        $resident->update($data);

        return response()->json(new ResidentResource($resident));
    }
}
