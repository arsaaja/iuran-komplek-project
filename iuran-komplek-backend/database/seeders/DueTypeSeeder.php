<?php

namespace Database\Seeders;

use App\Models\DueType;
use Illuminate\Database\Seeder;

class DueTypeSeeder extends Seeder
{
    public function run(): void
    {
        DueType::query()->updateOrCreate(
            ['code' => 'satpam'],
            ['name' => 'Iuran Satpam', 'amount' => 100000, 'is_active' => true]
        );

        DueType::query()->updateOrCreate(
            ['code' => 'kebersihan'],
            ['name' => 'Iuran Kebersihan', 'amount' => 15000, 'is_active' => true]
        );
    }
}
