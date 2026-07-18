<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Menghapus opsi 'cerai' dari enum marital_status.
     *
     * Kalau ada data penghuni yang sudah terlanjur berstatus 'cerai',
     * datanya diubah dulu jadi 'lajang' sebelum enum-nya diperketat,
     * supaya tidak ada baris yang gagal/terpotong saat ALTER TABLE.
     * Silakan ganti 'lajang' di bawah ini kalau mau dipetakan ke status lain.
     */
    public function up(): void
    {
        DB::table('residents')->where('marital_status', 'cerai')->update(['marital_status' => 'lajang']);

        DB::statement("ALTER TABLE residents MODIFY marital_status ENUM('lajang', 'menikah') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE residents MODIFY marital_status ENUM('lajang', 'menikah', 'cerai') NOT NULL");
    }
};
