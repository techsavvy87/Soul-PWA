<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeckCard extends Model
{
    use HasFactory;

    public function category()
    {
        return $this->belongsTo(DeckCardCategory::class, 'category_id', 'id');
    }

    // Cast JSON columns to array automatically
    protected $casts = [
        'emotions_id' => 'array',
        'guidances_id' => 'array',
    ];
}