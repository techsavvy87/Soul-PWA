<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Event extends Model
{
    protected $fillable = ['free_decks_id', 'paid_com_decks_id', 'paid_com_cards_cnt', 'paid_indi_decks_id', 'add_cards_cnt'];

    protected $casts = [
        'free_decks_id' => 'array',
        'paid_com_decks_id' => 'array', 
        'paid_indi_decks_id' => 'array',
    ];
}