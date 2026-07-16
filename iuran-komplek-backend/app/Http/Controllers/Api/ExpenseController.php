<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $expenses = Expense::query()
            ->when($request->filled('month'), fn ($q) => $q->whereMonth('expense_date', $request->integer('month')))
            ->when($request->filled('year'), fn ($q) => $q->whereYear('expense_date', $request->integer('year')))
            ->orderByDesc('expense_date')
            ->paginate($request->integer('per_page', 15));

        return response()->json($expenses);
    }

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = Expense::query()->create([
            ...$request->validated(),
            'created_by' => $request->user()?->id,
        ]);

        return response()->json($expense, 201);
    }

    public function update(StoreExpenseRequest $request, Expense $expense): JsonResponse
    {
        $expense->update($request->validated());

        return response()->json($expense);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        $expense->delete();

        return response()->json(['message' => 'Data pengeluaran berhasil dihapus.']);
    }
}
