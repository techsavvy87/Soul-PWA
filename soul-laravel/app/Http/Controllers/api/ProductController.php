<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StoreItem;
use App\Models\Transaction;

class ProductController extends Controller
{
    public function detail($id)
    {
        $product = StoreItem::find($id);

        return response()->json([
            'status' => true,
            'message' => 'Returned the product detail successfully',
            'result' => $product
        ], 200);
    }

    public function purchasedCheck($id)
    {
        $userId = auth()->id();
        $purchased = Transaction::where('user_id', $userId)->where('product_id', $id)->exists();

        return response()->json([
            'status' => $purchased,
        ], 200);
    }
}