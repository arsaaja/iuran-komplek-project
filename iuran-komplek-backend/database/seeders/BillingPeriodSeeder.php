<?php

namespace Database\Seeders;

use App\Services\BillingGeneratorService;
use Illuminate\Database\Seeder;

class BillingPeriodSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(BillingGeneratorService::class);
        $now = now();

        for ($i = 2; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $service->generate($date->month, $date->year);
        }
    }
}
