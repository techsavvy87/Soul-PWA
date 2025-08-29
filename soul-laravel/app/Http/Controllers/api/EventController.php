<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function listEvent(Request $request)
    {
        $events = Event::all();

        return response()->json([
            'status' => true,
            'message' => 'All Events pull',
            'result' => $events
        ], 200);
    }
}