<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DueType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DueTypeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(DueType::query()->orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:20', 'unique:due_types,code'],
            'name' => ['required', 'string', 'max:50'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $dueType = DueType::query()->create($data);

        return response()->json($dueType, 201);
    }

    public function update(Request $request, DueType $dueType): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:50'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $dueType->update($data);

        return response()->json($dueType);
    }

    public function destroy(DueType $dueType): JsonResponse
    {
        $dueType->delete();

        return response()->json(['message' => 'Jenis iuran berhasil dihapus.']);
    }
}
