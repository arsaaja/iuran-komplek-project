<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DueTypeController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ResidentController;
use Illuminate\Support\Facades\Route;

// ================= AUTH =================
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    // ================= MASTER DATA =================
    Route::apiResource('residents', ResidentController::class);
    Route::apiResource('houses', HouseController::class)->except(['destroy']);
    Route::delete('houses/{house}', [HouseController::class, 'destroy']);
    Route::get('houses/{house}/histories', [HouseController::class, 'histories']);

    Route::apiResource('due-types', DueTypeController::class)->except(['show']);

    // ================= TRANSAKSI =================
    Route::apiResource('payments', PaymentController::class)->only(['index', 'store', 'show']);
    Route::apiResource('expenses', ExpenseController::class)->except(['show']);

    // ================= LAPORAN =================
    Route::get('reports/summary', [ReportController::class, 'summary']);
    Route::get('reports/monthly-detail', [ReportController::class, 'monthlyDetail']);
});
