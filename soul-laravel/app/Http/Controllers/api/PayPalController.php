<?php

namespace App\Http\Controllers\api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\PayPalService;
use App\Models\Transaction;

class PayPalController extends Controller
{
    protected $paypal;

    public function __construct(PayPalService $paypal)
    {
        $this->paypal = $paypal;
    }

    // Create PayPal order
    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.1',
        ]);

        $order = $this->paypal->createOrder($request->amount);
        return response()->json($order);
    }

    // Capture PayPal order
    public function captureOrder(Request $request)
    {
        $request->validate([
            'orderId' => 'required|string',
        ]);

        $capture = $this->paypal->captureOrder($request->orderId);
        if ($capture['status'] === 'COMPLETED') {
            Transaction::create([
                'user_id' => auth()->id(),
                'product_id' => $request->productId,
                'paymented_at' => now(),
            ]);
        }
        return response()->json($capture);
    }
}