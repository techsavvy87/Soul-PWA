<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeckCardCategory;

class DeckController extends Controller
{
    public function listDeck(Request $request)
    {
        $decks = DeckCardCategory::all();

        return response()->json([
            'status' => true,
            'message' => 'All Decks pull',
            'result' => $decks
        ], 200);
    }
}