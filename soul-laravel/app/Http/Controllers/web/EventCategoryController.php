<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EventCategory;
use Illuminate\Support\Facades\Storage;

class EventCategoryController extends Controller
{
    public function listCategory()
    {
        $categories = EventCategory::all();

        $active = 'deckevent';
        return view('deckevent.category_list', compact('active', 'categories'));
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string',
            'category_level' => 'required|string',
            'category_type' => 'required|string',
            'info_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048|required',
        ]);

        
        $category = new EventCategory;
        $category->cname = $request->category_name;
        $category->level = $request->category_level;
        $category->type = $request->category_type;
        
        // Save the button image file
        $path = $request->info_img->store('public/deckcardcategories');
        $paths = explode("/", $path);
        $category->info_img = end($paths);
        
        
        $category->save();

        return redirect()->route('list-event-category')->with([
            'status'=>'success',
            'message'=> 'Event category has been created successfully.',
        ]);
    }

    public function updateCategory(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
            'category_name' => 'required|string',
            'category_type' => 'required|string',
            'category_level' => 'required|string',
            'info_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $id = $request->category_id;
        $category = EventCategory::find($id);
        $category->cname = $request->category_name;
        $category->type = $request->category_type;
        $category->level = $request->category_level;

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

        return redirect()->route('list-event-category')->with([
            'status'=>'success',
            'message'=> 'Deck post category has been updated successfully.',
        ]);
    }

    public function deleteCategory(Request $request) {
        $request->validate([
            'category_id' => 'required',
        ]);

        // $isEvent = DeckPost::where('category_id', $request->category_id)->exists();
        // if ($isDeckPost) {
        //     return back()->with([
        //         'status' => 'fail',
        //         'message' => "Can't delete because there're deck posts under it."
        //     ]);
        // }

        $category = EventCategory::find($request->category_id);
        if (!empty($category->info_img)) {
            Storage::delete('public/deckcardcategories/' . $category->info_img);
        }
        $category->delete();

        return redirect()->route('list-event-category')->with([
            'status'=>'success',
            'message'=> 'Event category has been deleted successfully.',
        ]);
    }
}