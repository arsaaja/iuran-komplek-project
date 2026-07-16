<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'house_id',
        'resident_id',
        'due_type_id',
        'period_month',
        'period_year',
        'amount',
        'status',
        'payment_item_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class);
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function dueType(): BelongsTo
    {
        return $this->belongsTo(DueType::class);
    }

    public function paymentItem(): BelongsTo
    {
        return $this->belongsTo(PaymentItem::class);
    }
}
