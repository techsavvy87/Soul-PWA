<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\DeckCard;

class DeckCardCategory extends Model
{
    use HasFactory;

    public function cards()
    {
        return $this->hasMany(DeckCard::class, 'category_id');
    }
}