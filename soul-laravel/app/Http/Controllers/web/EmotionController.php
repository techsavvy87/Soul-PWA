<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Emotion;

class EmotionController extends Controller
{
    public function listEmotions(Request $request)
    {
        $search = $request->input('search');
        $length = $request->input('length', 5); // default 5
        $emotions = Emotion::when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
        })
        ->paginate($length);

        $active = 'emotion';
        if ($request->ajax()) {
            return view('emotion.partials.table', compact('emotions'))->render();
        }

        return view('emotion.index', compact('active', 'emotions'));

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