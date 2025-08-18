<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Faq;

class FaqController extends Controller
{
    public function list(Request $request)
    {
        $faqs = Faq::all();
        
        // Check if FAQs exist
        if ($faqs->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No FAQs found',
                'result' => []
            ], 404);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Listed the faqs successfully',
                'result' => $faqs
            ], 200);
        }
    }
}