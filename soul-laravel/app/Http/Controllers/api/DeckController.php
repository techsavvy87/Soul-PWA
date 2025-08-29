<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeckCardCategory;
use Illuminate\Support\Facades\Log;

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

    public function listDeckCards(Request $request, $id)
    {
        $cards = DeckCardCategory::find($id)->cards;

        return response()->json([
            'status' => true,
            'message' => 'Deck cards retrieved successfully',
            'result' => $cards
        ], 200);
    }
}