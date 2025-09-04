<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reading;
use Illuminate\Support\Facades\Storage;

class ReadingController extends Controller
{
    public function listReadings()
    {
        $readings = Reading::all();
        $active = 'reading';
        return view('reading.list', compact('readings', 'active'));
    }


    public function addReading(Request $request)
    {
        $reading = new Reading();
        $reading->title = $request->input('info_title');
        $reading->description = $request->input('info_description');
        $reading->save();

        // return redirect()->route('list-reading');
        // Save the button image file
        $path = $request->info_img->store('public/reading');
        $paths = explode("/", $path);
        $reading->img = end($paths);
        $reading->save();

        return redirect()->route('list-reading')->with([
            'status'=>'success',
            'message'=> 'Reading has been created successfully.',
        ]);
    }

    public function updateReading(Request $request)
    {
        $id = $request->category_id;
        $reading = Reading::find($id);
        $reading->title = $request->input('info_title');
        $reading->description = $request->input('info_description');
        $reading->save();

        if (isset($request->info_img))
        {
            // delete existing file
            if (!empty($reading->img)) {
                Storage::delete('public/reading/' . $reading->img);
            }

            // save the image file
            $path = $request->info_img->store('public/reading');
            $paths = explode("/", $path);
            $reading->img = end($paths);
        }

        $reading->save();

        return redirect()->route('list-reading')->with([
            'status'=>'success',
            'message'=> 'Reading has been updated successfully.',
        ]);
    }

    public function deleteReading(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
        ]);

        $reading = Reading::find($request->category_id);
        if (!empty($reading->img)) {
            Storage::delete('public/reading/' . $reading->img);
        }
        $reading->delete();

        return redirect()->route('list-reading')->with([
            'status'=>'success',
            'message'=> 'Reading has been deleted successfully.',
        ]);
    }
}