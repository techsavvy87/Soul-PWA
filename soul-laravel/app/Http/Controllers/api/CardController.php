<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeckCardCategory;
use App\Models\Emotion;
use App\Models\Guidance;
use App\Models\DeckCard;

class CardController extends Controller
{
    public function getCards(Request $request)
    {
        $tier = $request->tier;
        $type = $request->type;
        $name = $request->name;

        // In case user is free and button is double.
        if ($tier === 'Free' && $type === 'Double') {
            $eventName = 'Personality Cards Decks 1';
            $deck = DeckCardCategory::where('cname', $eventName)->first();
            
            $cards = $deck->cards()
                            ->where('status', 'published')
                            ->inRandomOrder()
                            ->limit(3)
                            ->get();

            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $cards
            ], 200);
        }

        if ($tier === 'Free' && $type === 'Single') {
            $eventName = 'Sacred Action Deck';
            $deck = DeckCardCategory::where('cname', $eventName)->first();

            $cards = $deck->cards()
                            ->where('status', 'published')
                            ->inRandomOrder()
                            ->limit(1)
                            ->get();
                            
            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $cards
            ], 200);
        }


        if ($tier === 'Paid' && ($name !== 'Sacred Action' && $name !== 'Soul Mirror')) {
            $cards = $this->paidUserCards1();
            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $cards
            ], 200);
        }

        if ($tier === 'Paid' && $name === 'Sacred Action') {
            $deckName = 'Sacred Action Deck';
            $deck = DeckCardCategory::where('cname', $deckName)->first();

            $card = $deck->cards()
                            ->where('status', 'published')
                            ->inRandomOrder()
                            ->limit(1)
                            ->get();
                            
            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $card
            ], 200);
        }

        if ($tier === 'Paid' && $name === 'Soul Mirror') {
            $cards = $this->paidUserCards2();
            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $cards
            ], 200);
        }
    }

    public function paidUserCards2()
    {
        $pDeck2 = 'Personality Cards Decks 2';
        $pDeck3 = 'Personality Cards Decks 3';
        $transDeck = 'Transcendence Deck';
        $shankaraDeck = 'Shankara Master Deck';

        $pDeck2_id = DeckCardCategory::where('cname', $pDeck2)->first()->id;
        $pDeck3_id = DeckCardCategory::where('cname', $pDeck3)->first()->id;
        $transDeck_id = DeckCardCategory::where('cname', $transDeck)->first()->id;
        $shankaraDeck_id = DeckCardCategory::where('cname', $shankaraDeck)->first()->id;

        // Get one random card from either pDeck2 or pDeck3
        $deckIds = [$pDeck2_id, $pDeck3_id];
        $selectedCard = DeckCard::whereIn('category_id', $deckIds)
            ->where('status', 'published')
            ->inRandomOrder()
            ->limit(1)
            ->get();
        $transDeck = DeckCard::where('category_id', $transDeck_id)->where('status', 'published')->inRandomOrder()->limit(1)->get();
        $shankaraDeck = DeckCard::where('category_id', $shankaraDeck_id)->where('status', 'published')->inRandomOrder()->limit(1)->get();
        return $selectedCard->merge($transDeck)->merge($shankaraDeck);

    }

    public function paidUserCards1()
    {
        $deck1 = 'Personality Cards Decks 1';
        $deck2 = 'Personality Cards Decks 2';
        $deck3 = 'Personality Cards Decks 3';
        $deck4 = 'Transcendence Deck';
        $deck5 = 'Shankara Master Deck';

        
        $personalDeck1 = DeckCardCategory::where('cname', $deck1)->first();
        $personalDeck2 = DeckCardCategory::where('cname', $deck2)->first();
        $personalDeck3 = DeckCardCategory::where('cname', $deck3)->first();

        $personalDeck1_id = $personalDeck1->id;
        $personalDeck2_id = $personalDeck2->id;
        $personalDeck3_id = $personalDeck3->id;

        // Get any one from each pull.

        $personalDeck_ids = [$personalDeck1_id, $personalDeck2_id, $personalDeck3_id];
        $selectedPersonalDeckCard = DeckCard::whereIn('category_id', $personalDeck_ids)
                            ->where('status', 'published')
                            ->inRandomOrder()
                            ->limit(1)
                            ->get();
        $selectedPersonalDeckCardId = $selectedPersonalDeckCard->first()->id;
        
        $transDeck = DeckCardCategory::where('cname', $deck4)->first();
        $transDeck_id = $transDeck->id;
        $transDeckCard = DeckCard::where('category_id', $transDeck_id)
                    ->where('status', 'published')
                    ->inRandomOrder()
                    ->limit(1)
                    ->get();
        $selectedTransDeckCardId = $transDeckCard->first()->id;

        $shankaraDeck = DeckCardCategory::where('cname', $deck5)->first();
        $shankaraDeck_id = $shankaraDeck->id;
        $shankaraDeckCard = DeckCard::where('category_id', $shankaraDeck_id)
                            ->where('status', 'published')
                            ->inRandomOrder()
                            ->limit(1)
                            ->get();
        $selectedShankaraDeckCardId = $shankaraDeckCard->first()->id;

        // Get 2 additional cards without duplication.
        $additionalCards = DeckCard::whereNotIn('id', [$selectedPersonalDeckCardId, $selectedTransDeckCardId, $selectedShankaraDeckCardId])
            ->whereIn('category_id', [$personalDeck1_id, $personalDeck2_id, $personalDeck3_id, $transDeck_id, $shankaraDeck_id])
            ->where('status', 'published')
            ->inRandomOrder()
            ->limit(2)
            ->get();
        return $selectedPersonalDeckCard->merge($transDeckCard)->merge($shankaraDeckCard)->merge($additionalCards);
    }
}