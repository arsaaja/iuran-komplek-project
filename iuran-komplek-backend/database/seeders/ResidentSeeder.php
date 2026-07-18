<?php

namespace Database\Seeders;

use App\Models\Resident;
use Illuminate\Database\Seeder;

class ResidentSeeder extends Seeder
{
    public function run(): void
    {
        // 15 penghuni tetap
        for ($i = 1; $i <= 15; $i++) {
            Resident::query()->updateOrCreate(
                ['phone_number' => '0812' . str_pad((string) $i, 8, '0', STR_PAD_LEFT)],
                [
                    'name' => fake('id_ID')->name(),
                    'resident_type' => 'tetap',
                    'marital_status' => fake()->randomElement(['lajang', 'menikah']),
                    'is_active' => true,
                ]
            );
        }

        // 5 penghuni kontrak
        for ($i = 1; $i <= 5; $i++) {
            Resident::query()->updateOrCreate(
                ['phone_number' => '0813' . str_pad((string) $i, 8, '0', STR_PAD_LEFT)],
                [
                    'name' => fake('id_ID')->name(),
                    'resident_type' => 'kontrak',
                    'marital_status' => fake()->randomElement(['lajang', 'menikah']),
                    'is_active' => true,
                ]
            );
        }
    }
}
