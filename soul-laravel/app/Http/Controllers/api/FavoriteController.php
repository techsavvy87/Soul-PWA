<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\DeckCard;
use App\Models\Reading;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    public function toggleFavorite(Request $request)
    {
        $type = $request->type;
        
        // Card Favorite
        if ($type === 'card') {
            $userId = $request->userId;
            $cardId = $request->cardId;
        }
        // Reading Favorite
        if ($type === 'reading') {
            $userId = $request->userId;
            $cardId = $request->readingId;
        }
        
        // Find the favorite record
        $favorite = Favorite::where([
            'user_id' => $userId,
            'type' => $type,
            'card_id' => $cardId
        ])->first();

        if ($favorite) {
            // If it exists, delete it (unfavorite)
            $favorite->delete();
            return response()->json(['message' => 'Card unfavorited successfully.']);
        } else {
            // If it doesn't exist, create it (favorite)
            Favorite::create(['user_id' => $userId, 'card_id' => $cardId, 'type' => $type]);
            return response()->json(['message' => 'Card favorited successfully.']);
        }
    }

    public function checkFavorite(Request $request)
    {
        $type = $request->type;
        // Card Favorite
        if ($type === 'card') {
            $userId = $request->userId;
            $cardId = $request->cardId;
        }
        // Reading Favorite
        if ($type === 'reading') {
            $userId = $request->userId;
            $cardId = $request->readingId;
        }
        
        // Check if the favorite record exists
        $isFavorite = Favorite::where([
            'user_id' => $userId,
            'card_id' => $cardId,
            'type' => $type
        ])->exists();

        return response()->json(['isFavorited' => $isFavorite]);
    }

    public function listFavorites(Request $request)
    {
        $userId = $request->userId;

        // Get all favorited cards ids for the user
        $cardFavoritesIds = Favorite::where([
            'user_id' => $userId,
            'type' => 'card'
        ])->pluck('card_id');

        $favoritedCards = $cardFavoritesIds->map(function ($cardId) {
            return DeckCard::find($cardId);
        });

        // Get all favorited readings ids for the user
        $readingFavoritesIds = Favorite::where([
            'user_id' => $userId,
            'type' => 'reading'
        ])->pluck('card_id');

        $favoritedReadings = $readingFavoritesIds->map(function ($readingId) {
            return Reading::find($readingId);
        });

        return response()->json(['cards' => $favoritedCards, 'readings' => $favoritedReadings]);
    }
}