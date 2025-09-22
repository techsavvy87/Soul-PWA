<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Guidance;

class GuidanceController extends Controller
{
    public function listGuidance(Request $request)
    {
        $search = $request->input('search');
        $length = $request->input('length', 5); // default 5
        $guidances = Guidance::when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
        })
        ->paginate($length);

        $active = 'guidance';
        if ($request->ajax()) {
            return view('guidance.partials.table', compact('guidances'))->render();
        }

        return view('guidance.index', compact('active', 'guidances'));
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