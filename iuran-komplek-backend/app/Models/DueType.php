<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DueType extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'amount',
        'is_active',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
