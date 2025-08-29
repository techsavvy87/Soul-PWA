<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Emotion;
use App\Models\Guidance;

class StatusEmotionController extends Controller
{
    public function getStatusEmotion(Request $request) 
    {
        $tier = $request->tier;
        $type = $request->type;
        $name = $request->name;

        if ($type === "emotion") {
            $emotions = Emotion::all();
            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $emotions
            ], 200);
        }

        if ($type === "guidance") {
            $guidances = Guidance::all();
            return response()->json([
                'status' => true,
                'message' => 'OK',
                'result' => $guidances
            ], 200);
        }
    }
}