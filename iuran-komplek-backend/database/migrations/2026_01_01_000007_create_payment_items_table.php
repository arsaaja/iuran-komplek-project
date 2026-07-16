<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->foreignId('due_type_id')->constrained('due_types');
            $table->tinyInteger('period_month');
            $table->smallInteger('period_year');
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['lunas', 'belum'])->default('lunas');
            $table->timestamps();

            $table->unique(['due_type_id', 'period_month', 'period_year', 'payment_id'], 'payment_item_period_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_items');
    }
};
