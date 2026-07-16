<?php

namespace App\Console\Commands;

use App\Services\BillingGeneratorService;
use Illuminate\Console\Command;

class GenerateMonthlyBilling extends Command
{
    protected $signature = 'billing:generate {--month=} {--year=}';

    protected $description = 'Membuat tagihan bulanan (satpam & kebersihan) untuk semua rumah berstatus dihuni.';

    public function handle(BillingGeneratorService $service): int
    {
        $month = (int) ($this->option('month') ?: now()->month);
        $year = (int) ($this->option('year') ?: now()->year);

        $created = $service->generate($month, $year);

        $this->info("Berhasil membuat {$created} tagihan baru untuk periode {$month}/{$year}.");

        return self::SUCCESS;
    }
}
