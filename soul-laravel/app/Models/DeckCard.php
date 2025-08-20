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

    public function emotion()
    {
        return $this->belongsTo(Emotion::class, 'emotion_id', 'id');
    }

    public function guidance()
    {
        return $this->belongsTo(Guidance::class, 'guidance_id', 'id');
    }
}