<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guidance extends Model
{
    public function card() {
        return $this->belongsTo(DeckCard::class);
    }
}