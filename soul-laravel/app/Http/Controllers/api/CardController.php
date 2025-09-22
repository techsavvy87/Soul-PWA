<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeckCardCategory;
use App\Models\Emotion;
use App\Models\Guidance;
use App\Models\DeckCard;
use App\Models\Event;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendCard;


class CardController extends Controller
{
    public function getCards(Request $request)
    {
        $tier = $request->tier;
        $type = $request->type;
        $name = $request->name;
        
        $event_id = $request->id;
        $event = Event::find($event_id);

        // If the user is on a free plan
        if ($tier === 'Free') {
            $decks = $event->free_decks_id;
            $deckArr = [];
            foreach($decks as $deck) {
                $deckArr[] = [
                    'id' => $deck['id'],
                    'cnt' => $deck['cnt']
                ];
            }

            $cardArr = [];
            foreach($deckArr as $item) {
                $deck = DeckCardCategory::find($item['id']);
                $cards = $deck->cards()
                            ->where('status', 'published')
                            ->inRandomOrder()
                            ->limit($item['cnt'])
                            ->get();
                foreach($cards as $card) {
                    $cardArr[] = $card;
                }
                
            }
            
            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $cardArr
            ], 200);
        } else {
            // If the user is on a paid plan
            $deckCom = $event->paid_com_decks_id;
            $deckIndi = $event->paid_indi_decks_id;
            $deckComCnt = $event->paid_com_cards_cnt;
            $deckAddCnt = $event->add_cards_cnt;
            $deckComIds = [];
            $deckIndiArr = [];

            if ($deckCom) {
                foreach($deckCom as $deck) {
                    $deckComIds[] = $deck['id'];
                }
            }

            if ($deckIndi) {
                foreach($deckIndi as $deck) {
                    $deckIndiArr[] = [
                        'id' => $deck['id'],
                        'cnt' => $deck['cnt']
                    ];
                }
            }

            // If combined and individual decks all exist
            $cardArr = [];
            $selComCard = DeckCard::whereIn('category_id', $deckComIds)
                        ->where('status', 'published')
                        ->inRandomOrder()
                        ->limit($deckComCnt)
                        ->get();
            
            $comDeckFlag = 'comdeck';
            $indiDeckIds = collect($deckIndiArr)->pluck('id');

            foreach($deckIndiArr as $item) {
                $deck = DeckCardCategory::find($item['id']);
                $cards = $deck->cards()
                            ->where('status', 'published')
                            ->inRandomOrder()
                            ->limit($item['cnt'])
                            ->get();
                foreach($cards as $card) {
                    $cardArr[] = $card;
                }
            }
            $cardArr = $selComCard->merge($cardArr);
            $selCardIds = $cardArr->pluck('id');
            $selDeckIds = collect([$comDeckFlag])->merge($indiDeckIds);
            // Get additional cards without duplication
            $addRandDeckId = $selDeckIds[array_rand($selDeckIds->toArray())];
            if ($addRandDeckId === 'comdeck') {
                $addCards = DeckCard::whereIn('category_id', $deckComIds)
                    ->where('status', 'published')
                    ->whereNotIn('id', $selCardIds) // Exclude selected card IDs
                    ->inRandomOrder()
                    ->limit($deckAddCnt)
                    ->get();
            } else {
                $addCards = DeckCard::where('category_id', $addRandDeckId)
                    ->where('status', 'published')
                    ->whereNotIn('id', $selCardIds) // Exclude selected card IDs
                    ->inRandomOrder()
                    ->limit($deckAddCnt)
                    ->get();
            }
            $cardArr = $cardArr->merge($addCards);
            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $cardArr
            ], 200);
        }
    }

    public function getAdjCards(Request $request) 
    {
        $adjSort = $request->adjSort;
        $adjIds = $request->adjIds;

        $cards = DeckCard::where(function($query) use ($adjIds, $adjSort) {
            foreach ($adjIds as $id) {
                $query->orWhereJsonContains($adjSort.'s_id', $id) // matches JSON arrays
                    ->orWhere($adjSort.'s_id', $id);           // matches single integers
            }
        })
        ->inRandomOrder()  // randomize the order
        ->take(rand(3,5)) // pick 3 to 5 random results
        ->get();

        return response()->json([
            'status' => true,
            'message' => 'OK',
            'result' => $cards
        ], 200);
    }

    public function getCardById($id)
    {
        $card = DeckCard::find($id);
        if (!$card) {
            return response()->json(['status' => false, 'message' => 'Card not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $card]);
    }

    public function sendCardEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'cardUrl' => 'required|string',
        ]);

        $email = $request->email;
        $cardUrl = $request->cardUrl;

        $mailData = [
            'cardUrl' => $cardUrl     
        ];

        Mail::to($email)->send(new SendCard($mailData));

        return response()->json([
            'status' => true,
            'message' => "Card has been sent to {$email}.",
        ]);
    }
}