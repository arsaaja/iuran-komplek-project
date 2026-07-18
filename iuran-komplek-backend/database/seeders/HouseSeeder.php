<?php

namespace Database\Seeders;

use App\Models\House;
use App\Models\HouseResidentHistory;
use App\Models\Resident;
use Illuminate\Database\Seeder;

class HouseSeeder extends Seeder
{
    /**
     * Membuat 20 rumah (15 tetap + 5 kontrak) sesuai jumlah di spesifikasi awal,
     * dan langsung menghubungkannya ke penghuni dari ResidentSeeder (harus
     * dijalankan lebih dulu). Semua rumah dibuat berstatus "dihuni" sebagai
     * data awal; untuk menguji aturan "rumah kontrak hanya ditagih kalau ada
     * penghuninya", tinggal ubah status salah satu rumah kontrak jadi
     * "tidak_dihuni" lewat halaman Rumah setelah data ini di-seed.
     */
    public function run(): void
    {
        $tetapResidents = Resident::query()->where('resident_type', 'tetap')->orderBy('id')->get();
        $kontrakResidents = Resident::query()->where('resident_type', 'kontrak')->orderBy('id')->get();

        foreach ($tetapResidents as $index => $resident) {
            $house = House::query()->updateOrCreate(
                ['house_number' => sprintf('Blok A-%02d', $index + 1)],
                [
                    'house_type' => 'tetap',
                    'status' => 'dihuni',
                    'current_resident_id' => $resident->id,
                ]
            );

            $this->recordHistory($house, $resident);
        }

        foreach ($kontrakResidents as $index => $resident) {
            $house = House::query()->updateOrCreate(
                ['house_number' => sprintf('Blok B-%02d', $index + 1)],
                [
                    'house_type' => 'kontrak',
                    'status' => 'dihuni',
                    'current_resident_id' => $resident->id,
                ]
            );

            $this->recordHistory($house, $resident);
        }
    }

    private function recordHistory(House $house, Resident $resident): void
    {
        $alreadyRecorded = HouseResidentHistory::query()
            ->where('house_id', $house->id)
            ->where('resident_id', $resident->id)
            ->whereNull('end_date')
            ->exists();

        if (! $alreadyRecorded) {
            HouseResidentHistory::query()->create([
                'house_id' => $house->id,
                'resident_id' => $resident->id,
                'start_date' => now()->toDateString(),
            ]);
        }
    }
}
