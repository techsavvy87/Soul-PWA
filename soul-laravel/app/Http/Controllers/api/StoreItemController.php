<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StoreItem;

class StoreItemController extends Controller
{
    public function listStore()
    {
        // Logic to list store items
        $storeItems = StoreItem::all();
        return response()->json([
            'status' => true,
            'message' => 'OK',
            'result' => $storeItems
        ], 200);
    }
}