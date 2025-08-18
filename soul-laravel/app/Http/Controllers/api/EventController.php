<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EventCategory;

class EventController extends Controller
{
    public function listEvent(Request $request)
    {
        $events = EventCategory::all();

        return response()->json([
            'status' => true,
            'message' => 'All Events pull',
            'result' => $events
        ], 200);
    }
}