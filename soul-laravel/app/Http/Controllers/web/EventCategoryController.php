<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\DeckCardCategory;
use App\Models\DeckOrganization;
use Illuminate\Support\Facades\Storage;

class EventCategoryController extends Controller
{
    public function listCategory()
    {
        $events = Event::all();
        $decks = DeckCardCategory::all();

        $active = 'deckevent';
        return view('deckevent.category_list', compact('active', 'events', 'decks'));
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string',
            'category_level' => 'required|string',
            'info_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048|required',
        ]);

        $event = new Event;
        $event->name = $request->category_name;
        $event->level = $request->category_level;
        
        // Save the button image file
        $path = $request->info_img->store('public/events');
        $paths = explode("/", $path);
        $event->img_url = end($paths);

        $event->scroll_sort = $request->scroll_sort;
        $event->free_decks_id = json_decode($request->free_deck_id, true);
        $event->paid_com_decks_id = json_decode($request->paid_combined_deck_id, true);
        $event->paid_com_cards_cnt = $request->paid_combined_cards_cnt;;
        $event->paid_indi_decks_id = json_decode($request->paid_individual_deck_id, true);
        $event->add_cards_cnt = $request->additional_cards_cnt;
        
        $event->save();

        return redirect()->route('list-event-category')->with([
            'status'=>'success',
            'message'=> 'Event has been created successfully.',
        ]);
    }

    public function updateCategory(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
            'category_level' => 'required|string',
            'info_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $id = $request->category_id;
        $event = Event::find($id);
        $event->name = $request->category_name;
        $event->level = $request->category_level;

        if (isset($request->info_img))
        {
            // delete existing file
            if (!empty($event->img_url)) {
                Storage::delete('public/events/' . $event->img_url);
            }

            // save the image file
            $path = $request->info_img->store('public/events');
            $paths = explode("/", $path);
            $event->img_url = end($paths);
        }

        $event->scroll_sort = $request->scroll_sort;
        $event->free_decks_id = json_decode($request->free_deck_id, true);
        $event->paid_com_decks_id = json_decode($request->paid_combined_deck_id, true);
        $event->paid_com_cards_cnt = $request->paid_combined_cards_cnt;;
        $event->paid_indi_decks_id = json_decode($request->paid_individual_deck_id, true);
        $event->add_cards_cnt = $request->additional_cards_cnt;

        $event->save();

        return redirect()->route('list-event-category')->with([
            'status'=>'success',
            'message'=> 'Event has been updated successfully.',
        ]);
    }

    public function deleteCategory(Request $request) {
        $request->validate([
            'category_id' => 'required',
        ]);

        $event = Event::find($request->category_id);
        if (!empty($event->img_url)) {
            Storage::delete('public/events/' . $event->img_url);
        }
        $event->delete();

        return redirect()->route('list-event-category')->with([
            'status'=>'success',
            'message'=> 'Event category has been deleted successfully.',
        ]);
    }
}