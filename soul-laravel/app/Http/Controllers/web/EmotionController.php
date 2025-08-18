<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Emotion;

class EmotionController extends Controller
{
    public function listEmotions()
    {
        $emotions = Emotion::all();

        $active = 'emotion';
        return view('emotion.emotion_list', compact('active', 'emotions'));
    }

    public function addEmotion(Request $request)
    {
        $request->validate([
            'emotion_name' => 'required|string',
        ]);
        
        $emotion = new Emotion;
        $emotion->name = $request->emotion_name;
        $emotion->save();

        return redirect()->route('list-emotion')->with([
            'status'=>'success',
            'message'=> 'Emotion has been created successfully.',
        ]);
    }

    public function updateEmotion(Request $request)
    {
        $request->validate([
            'emotion_name' => 'required|string',
            'emotion_id' => 'required'
        ]);

        $id = $request->emotion_id;
        $emotion = Emotion::find($id);
        $emotion->name = $request->emotion_name;

        $emotion->save();

        return redirect()->route('list-emotion')->with([
            'status'=>'success',
            'message'=> 'Emotion has been updated successfully.',
        ]);
    }

    public function deleteEmotion(Request $request)
    {
        $request->validate([
            'emotion_id' => 'required',
        ]);

        $id = $request->emotion_id;
        $emotion = Emotion::find($id);
        $emotion->delete();

        return redirect()->route('list-emotion')->with([
            'status'=>'success',
            'message'=> 'Emotion has been deleted successfully.',
        ]);
    }
}