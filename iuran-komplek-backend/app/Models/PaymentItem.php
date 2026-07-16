<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'due_type_id',
        'period_month',
        'period_year',
        'amount',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function dueType(): BelongsTo
    {
        return $this->belongsTo(DueType::class);
    }
}
