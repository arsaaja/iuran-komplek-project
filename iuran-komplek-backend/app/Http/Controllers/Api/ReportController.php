<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reportService) {}

    /**
     * Ringkasan saldo pemasukan & pengeluaran per bulan untuk 1 tahun (untuk grafik).
     * GET /api/reports/summary?year=2026
     */
    public function summary(Request $request): JsonResponse
    {
        $year = $request->integer('year', now()->year);

        return response()->json($this->reportService->yearlySummary($year));
    }

    /**
     * Detail pemasukan & pengeluaran untuk bulan tertentu.
     * GET /api/reports/monthly-detail?month=7&year=2026
     */
    public function monthlyDetail(Request $request): JsonResponse
    {
        $request->validate([
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
        ]);

        return response()->json(
            $this->reportService->monthlyDetail($request->integer('month'), $request->integer('year'))
        );
    }
}
