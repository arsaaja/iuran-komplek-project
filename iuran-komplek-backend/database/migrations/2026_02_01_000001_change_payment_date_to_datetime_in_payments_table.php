<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Mengubah kolom payment_date dari DATE menjadi DATETIME agar bisa
     * menyimpan jam pembayaran, tanpa menghapus data yang sudah ada.
     * Data tanggal lama otomatis mendapat jam 00:00:00.
     *
     * Sengaja pakai raw SQL (bukan $table->dateTime()->change()) supaya
     * tidak perlu tambah dependency doctrine/dbal di composer.json.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE payments MODIFY payment_date DATETIME NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE payments MODIFY payment_date DATE NOT NULL');
    }
};
