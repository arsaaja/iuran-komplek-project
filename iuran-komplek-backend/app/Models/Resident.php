<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'ktp_photo_path',
        'resident_type',
        'phone_number',
        'marital_status',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Rumah yang saat ini dihuni oleh penghuni ini (jika ada).
     */
    public function currentHouse(): HasOne
    {
        return $this->hasOne(House::class, 'current_resident_id');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(HouseResidentHistory::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function billingPeriods(): HasMany
    {
        return $this->hasMany(BillingPeriod::class);
    }
}
