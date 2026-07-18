<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\PaymentItem;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Ringkasan pemasukan, pengeluaran, dan saldo per bulan untuk satu tahun.
     * Cocok untuk data grafik (line/bar chart) di frontend.
     */
    public function yearlySummary(int $year): array
    {
        $income = PaymentItem::query()
            ->selectRaw('period_month as month, SUM(amount) as total')
            ->where('period_year', $year)
            ->groupBy('period_month')
            ->pluck('total', 'month');

        $expense = Expense::query()
            ->selectRaw('MONTH(expense_date) as month, SUM(amount) as total')
            ->whereYear('expense_date', $year)
            ->groupBy(DB::raw('MONTH(expense_date)'))
            ->pluck('total', 'month');

        $result = [];
        $runningBalance = 0;

        for ($month = 1; $month <= 12; $month++) {
            $monthIncome = (float) ($income[$month] ?? 0);
            $monthExpense = (float) ($expense[$month] ?? 0);
            $runningBalance += ($monthIncome - $monthExpense);

            $result[] = [
                'month' => $month,
                'income' => $monthIncome,
                'expense' => $monthExpense,
                'balance' => $monthIncome - $monthExpense,
                'running_balance' => $runningBalance,
            ];
        }

        return [
            'year' => $year,
            'data' => $result,
            'total_income' => array_sum(array_column($result, 'income')),
            'total_expense' => array_sum(array_column($result, 'expense')),
            'final_balance' => $runningBalance,
        ];
    }

    /**
     * Detail rincian pemasukan (siapa bayar, jenis iuran) dan pengeluaran
     * untuk satu bulan tertentu.
     */
    public function monthlyDetail(int $month, int $year): array
    {
        $incomes = PaymentItem::query()
            ->with(['dueType', 'payment.resident', 'payment.house'])
            ->where('period_month', $month)
            ->where('period_year', $year)
            ->get()
            ->map(fn($item) => [
                'resident' => $item->payment->resident->name ?? null,
                'house_number' => $item->payment->house->house_number ?? null,
                'due_type' => $item->dueType->name ?? null,
                'amount' => (float) $item->amount,
                'paid_at' => $item->payment->payment_date?->toDateTimeString(),
            ]);

        $expenses = Expense::query()
            ->whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->get(['category', 'amount', 'expense_date', 'description'])
            ->map(fn($expense) => [
                'category' => $expense->category,
                'amount' => (float) $expense->amount,
                'date' => $expense->expense_date?->toDateString(),
                'description' => $expense->description,
            ]);

        return [
            'month' => $month,
            'year' => $year,
            'incomes' => $incomes,
            'expenses' => $expenses,
            'total_income' => $incomes->sum('amount'),
            'total_expense' => $expenses->sum('amount'),
            'balance' => $incomes->sum('amount') - $expenses->sum('amount'),
        ];
    }
}
