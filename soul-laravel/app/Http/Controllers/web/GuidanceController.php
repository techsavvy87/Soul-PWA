<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Guidance;

class GuidanceController extends Controller
{
    public function listGuidance()
    {
        $guidances = Guidance::all();

        $active = 'guidance';
        return view('guidance.guidance_list', compact('active', 'guidances'));
    }

    public function addGuidance(Request $request)
    {
        $request->validate([
            'guidance_name' => 'required|string',
        ]);
        
        $guidance = new Guidance;
        $guidance->name = $request->guidance_name;
        $guidance->save();

        return redirect()->route('list-guidance')->with([
            'status'=>'success',
            'message'=> 'Guidance has been created successfully.',
        ]);
    }

    public function updateGuidance(Request $request)
    {
        $request->validate([
            'guidance_name' => 'required|string',
            'guidance_id' => 'required'
        ]);

        $id = $request->guidance_id;
        $guidance = Guidance::find($id);
        $guidance->name = $request->guidance_name;

        $guidance->save();

        return redirect()->route('list-guidance')->with([
            'status'=>'success',
            'message'=> 'Guidance has been updated successfully.',
        ]);
    }

    public function deleteGuidance(Request $request)
    {
        $request->validate([
            'guidance_id' => 'required',
        ]);

        $id = $request->guidance_id;
        $guidance = Guidance::find($id);
        $guidance->delete();

        return redirect()->route('list-guidance')->with([
            'status'=>'success',
            'message'=> 'Guidance has been deleted successfully.',
        ]);
    }
}