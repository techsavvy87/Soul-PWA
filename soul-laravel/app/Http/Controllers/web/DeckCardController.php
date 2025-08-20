<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeckCard;
use App\Models\DeckCardCategory;
use App\Models\Emotion;
use App\Models\Guidance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class DeckCardController extends Controller
{
    public function listCards()
    {
        $cards = DeckCard::all();

        $active = 'deckcard';
        return view('deckcard.card_list', compact('active', 'cards'));
    }

    public function cardAdd(Request $request)
    {
        $decks = DeckCardCategory::all();
        $emotions = Emotion::all();
        $guidances = Guidance::all();

        $active = 'deckcard';
        return view('deckcard.card_create', compact('active', 'decks', 'emotions', 'guidances'));
    }

    public function cardDelete(Request $request) {
        $request->validate([
            'card_id' => 'required',
        ]);

        $id = $request->card_id;


        $deckCard = DeckCard::find($id);
        if (!empty($deckCard->card_img)) {
            Storage::delete('public/deckcards/' . $deckCard->card_img);
        }

        $deckCard->delete();

        return redirect()->route('list-card')->with([
            'status'=>'success',
            'message'=> 'Deck card has been deleted successfully.',
        ]);
    }

    public function cardCreate(Request $request)
    {
        $request->validate([
            'card_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'title' => 'required|string',
            'category' => 'required|integer',
            'emotion' => 'required|integer',
            'guidance' => 'required|integer',
            'status' => 'required|string',
        ]);

        $deckCard = new DeckCard;
        $deckCard->title = $request->title;
        $deckCard->description = $request->description;
        $deckCard->category_id = $request->category;
        $deckCard->emotion_id = $request->emotion;
        $deckCard->guidance_id = $request->guidance;
        $deckCard->status = $request->status;

        if ($request->status === 'published')
            $deckCard->published_at = Carbon::now();


        if (isset($request->card_img))
        {
            // save the image file
            $path = $request->card_img->store('public/deckcards');
            $paths = explode("/", $path);
            $deckCard->card_img = end($paths);
        }

        $deckCard->save();

        return redirect()->route('list-card')->with([
            'status'=>'success',
            'message'=> 'Deck card has been created successfully.',
        ]);
    }

    public function cardEdit($id)
    {
        $deckCard = DeckCard::find($id);
        $decks = DeckCardCategory::all();
        $emotions = Emotion::all();
        $guidances = Guidance::all();

        $active = 'deckcard';
        return view('deckcard.card_update', compact('deckCard', 'active', 'decks', 'emotions', 'guidances'));
    }

    public function cardUpdate(Request $request) 
    {
        $request->validate([
            'card_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'title' => 'required|string',
            'category' => 'required|integer',
            'emotion' => 'required|integer',
            'guidance' => 'required|integer',
            'status' => 'required|string',
            'card_id' => 'required'
        ]);

        $id = $request->card_id;
        $deckCard = DeckCard::find($id);
        $deckCard->title = $request->title;
        $deckCard->description = $request->description;
        $deckCard->category_id = $request->category;
        $deckCard->emotion_id = $request->emotion;
        $deckCard->guidance_id = $request->guidance;
        $deckCard->status = $request->status;

        if ($request->status != $deckCard->status) {
            if ($request->status === 'published')
                $deckCard->published_at = Carbon::now();
            else
                $deckCard->published_at = NULL;
        }

       

        if (isset($request->card_img))
        {
            // delete existing file
            if (!empty($deckPost->card_img)) {
                Storage::delete('public/deckposts/' . $deckCard->card_img);
            }

            // save the image file
            $path = $request->card_img->store('public/deckposts');
            $paths = explode("/", $path);
            $deckCard->card_img = end($paths);
        }

        $deckCard->save();

        return redirect()->route('list-card')->with([
            'status'=>'success',
            'message'=> 'Deck card has been updated successfully.',
        ]);
    }
}