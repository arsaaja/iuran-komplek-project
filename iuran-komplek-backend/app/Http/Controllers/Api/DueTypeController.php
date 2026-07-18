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

}
