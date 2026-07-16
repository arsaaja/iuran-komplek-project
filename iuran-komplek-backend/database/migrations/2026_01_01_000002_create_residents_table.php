<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('ktp_photo_path')->nullable();
            $table->enum('resident_type', ['tetap', 'kontrak']);
            $table->string('phone_number', 20);
            $table->enum('marital_status', ['lajang', 'menikah', 'cerai']);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
