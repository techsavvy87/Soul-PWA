<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeckCardCategory;
use Illuminate\Support\Facades\Storage;
use App\Models\DeckCard;

class DeckCardCategoryController extends Controller
{
    public function listCategory(Request $request)
    {
        $categories = DeckCardCategory::all();

        $active = 'deckcard';
        return view('deckcard.category_list', compact('active', 'categories'));
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string',
            'category_level' => 'required|string',
            'info_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048|required',
            'info_title' => 'required|string',
            'info_description' => 'required|string',
        ]);

        
        $category = new DeckCardCategory;
        $category->cname = $request->category_name;
        $category->level = $request->category_level;
        $category->info_title = $request->info_title;
        $category->info_description = $request->info_description;
        
        // Save the button image file
        $path = $request->info_img->store('public/deckcardcategories');
        $paths = explode("/", $path);
        $category->info_img = end($paths);
        
        
        $category->save();

        return redirect()->route('list-deck-category')->with([
            'status'=>'success',
            'message'=> 'Deck card category has been created successfully.',
        ]);
    }

    public function deleteCategory(Request $request) {
        $request->validate([
            'category_id' => 'required',
        ]);

        $isDeckCard = DeckCard::where('category_id', $request->category_id)->exists();
        if ($isDeckCard) {
            return back()->with([
                'status' => 'fail',
                'message' => "Can't delete because there're deck cards under it."
            ]);
        }

        $category = DeckCardCategory::find($request->category_id);
        if (!empty($category->info_img)) {
;
            Storage::delete('public/deckcardcategories/' . $category->info_img);
        }
        $category->delete();

        return redirect()->route('list-deck-category')->with([
            'status'=>'success',
            'message'=> 'Deck card category has been deleted successfully.',
        ]);
    }


    public function updateCategory(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
            'category_name' => 'required|string',
            'category_level' => 'required|string',
            'info_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'info_title' => 'required|string',
            'info_description' => 'required|string',
        ]);

        $id = $request->category_id;
        $category = DeckCardCategory::find($id);
        $category->cname = $request->category_name;
        $category->level = $request->category_level;
        $category->info_title = $request->info_title;
        $category->info_description = $request->info_description;

        if (isset($request->info_img))
        {
            // delete existing file
            if (!empty($category->info_img)) {
                Storage::delete('public/deckcardcategories/' . $category->info_img);
            }

            // save the image file
            $path = $request->info_img->store('public/deckcardcategories');
            $paths = explode("/", $path);
            $category->info_img = end($paths);
        }

        $category->save();

        return redirect()->route('list-deck-category')->with([
            'status'=>'success',
            'message'=> 'Deck card category has been updated successfully.',
        ]);
    }
}