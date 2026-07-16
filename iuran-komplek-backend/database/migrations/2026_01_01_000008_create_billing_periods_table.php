<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->foreignId('due_type_id')->constrained('due_types');
            $table->tinyInteger('period_month');
            $table->smallInteger('period_year');
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['lunas', 'belum'])->default('belum');
            $table->foreignId('payment_item_id')->nullable()->constrained('payment_items')->nullOnDelete();
            $table->timestamps();

            $table->unique(['house_id', 'due_type_id', 'period_month', 'period_year'], 'billing_period_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_periods');
    }
};
