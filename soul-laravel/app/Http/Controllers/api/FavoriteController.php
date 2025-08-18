<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\DeckCard;

class FavoriteController extends Controller
{
    public function toggleFavorite(Request $request)
    {
        $userId = $request->userId;
        $cardId = $request->cardId;

        // Find the favorite record
        $favorite = Favorite::where('user_id', $userId)->where('card_id', $cardId)->first();

        if ($favorite) {
            // If it exists, delete it (unfavorite)
            $favorite->delete();
            return response()->json(['message' => 'Card unfavorited successfully.']);
        } else {
            // If it doesn't exist, create it (favorite)
            Favorite::create(['user_id' => $userId, 'card_id' => $cardId]);
            return response()->json(['message' => 'Card favorited successfully.']);
        }
    }

    public function checkFavorite(Request $request)
    {
        $userId = $request->user_id;
        $cardId = $request->card_id;

        // Check if the favorite record exists
        $isFavorite = Favorite::where('user_id', $userId)->where('card_id', $cardId)->exists();

        return response()->json(['isFavorited' => $isFavorite]);
    }

    public function listFavorites(Request $request)
    {
        $userId = $request->user_id;

        // Get all favorite cards for the user
        $favorites = Favorite::where('user_id', $userId)->get();
        $favoritedCards = $favorites->map(function ($favorite) {
            return $favorite->card;
        });
        return response()->json(['favorites' => $favoritedCards]);
    }
}