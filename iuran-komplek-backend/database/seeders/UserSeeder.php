<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'rt@komplek.test'],
            [
                'name' => 'Pak RT',
                'password' => Hash::make('password'),
                'role' => 'rt',
            ]
        );
    }
}
