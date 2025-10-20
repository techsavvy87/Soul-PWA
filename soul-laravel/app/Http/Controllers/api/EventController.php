<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\SessionAuthor;

class EventController extends Controller
{
    public function listEvent(Request $request)
    {
        $events = Event::all();
        $sessionAuthor = SessionAuthor::first();
        
        return response()->json([
            'status' => true,
            'message' => 'All Events pull',
            'result' => [
                'events' => $events,
                'session' => $sessionAuthor
            ],
        ], 200);
    }
}