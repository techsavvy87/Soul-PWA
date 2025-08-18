<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\About;
use App\Models\CreativeLab;
use App\Models\Concept;

class SettingsController extends Controller
{
    public function getAbout(Request $request)
    {
        $about = About::first();

        if (isset($about)) {
            $about->cover_img_url = empty($about->cover_img) ? '' : asset('storage/about/' . $about->cover_img);
        }

        return response()->json([
            'status' => true,
            'message' => 'Fetched the about successfully',
            'result' => $about
        ], 200);
    }

    public function getCreative(Request $request)
    {
        $creative = CreativeLab::first();
        $creativeContent = isset($creative) ? $creative->description : '';

        return response()->json([
            'status' => true,
            'message' => 'Fetched the content of CreativeLab.TV successfully',
            'result' => $creativeContent
        ], 200);
    }

    public function getConcept(Request $request)
    {
        $concept = Concept::first();
        $conceptData = isset($concept) ? $concept->description : '';

        return response()->json([
            'status' => true,
            'message' => 'Fetched the concept successfully',
            'result' => $conceptData
        ], 200);
    }
}