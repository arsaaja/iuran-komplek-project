<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('house_number', 20)->unique();
            $table->enum('house_type', ['tetap', 'kontrak']);
            $table->enum('status', ['dihuni', 'tidak_dihuni'])->default('tidak_dihuni');
            $table->foreignId('current_resident_id')->nullable()->constrained('residents')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('houses');
    }
};
