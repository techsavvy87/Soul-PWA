<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StoreItem; 
use Illuminate\Support\Facades\Storage;

class StoreItemController extends Controller
{
    public function listStore(Request $request)
    {
        // Logic to list store items
        $storeItems = StoreItem::all();
        $active = 'store';
        return view('store.list', compact('active', 'storeItems'));
    }

    public function newStoreForm()
    {
        // Logic to show create store item form
        $active = 'store';
        return view('store.create', compact('active'));
    }

    public function createStore(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'type' => 'required|string',
            'store_img' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $storeItem = new StoreItem;
        $storeItem->title = $request->title;
        $storeItem->description = $request->description;
        $storeItem->price = $request->price;
        $storeItem->type = $request->type;

        if ($request->hasFile('store_img')) {
            $imagePath = $request->file('store_img')->store('public/store');
            $storeItem->img = basename($imagePath);
        }

        $storeItem->save();

        return redirect()->route('list-store')->with([
            'status' => 'success',
            'message' => 'Store item created successfully.',
        ]);
    }   

    public function editStore($id)
    {
        $storeItem = StoreItem::findOrFail($id);
        $active = 'store';
        return view('store.edit', compact('active', 'storeItem'));
    }   

    public function updateStore(Request $request)
    {
        $request->validate([
            'store_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'title' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'type' => 'required|string',
            'store_id' => 'required'
        ]);

        $id = $request->store_id;

        $storeItem = StoreItem::findOrFail($id);
        $storeItem->title = $request->title;
        $storeItem->description = $request->description;
        $storeItem->price = $request->price;
        $storeItem->type = $request->type;

        if (isset($request->store_img))
        {
            // delete existing file
            if (!empty($storeItem->img)) {
                Storage::delete('public/store/' . $storeItem->img);
            }

            // save the image file
            $path = $request->store_img->store('public/store');
            $paths = explode("/", $path);
            $storeItem->img = end($paths);
        }

        $storeItem->save();

        return redirect()->route('list-store')->with([
            'status'=>'success',
            'message'=> 'Store item has been updated successfully.',
        ]);
    }

    public function deleteStore(Request $request)
    {
        $request->validate([
            'store_id' => 'required',
        ]);

        $id = $request->store_id;

        $storeItem = StoreItem::findOrFail($id);

        // delete the image file
        if (!empty($storeItem->img)) {
            Storage::delete('public/store/' . $storeItem->img);
        }

        $storeItem->delete();

        return redirect()->route('list-store')->with([
            'status' => 'success',
            'message' => 'Store item deleted successfully.',
        ]);
    }   
}