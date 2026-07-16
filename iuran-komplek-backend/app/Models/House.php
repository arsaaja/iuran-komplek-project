<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'house_number',
        'house_type',
        'status',
        'current_resident_id',
    ];

    public function currentResident(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'current_resident_id');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(HouseResidentHistory::class)->orderByDesc('start_date');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function billingPeriods(): HasMany
    {
        return $this->hasMany(BillingPeriod::class);
    }

    public function isDihuni(): bool
    {
        return $this->status === 'dihuni';
    }
}
