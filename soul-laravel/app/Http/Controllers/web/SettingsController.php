<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\About;
use App\Models\AboutSoul;
use App\Models\CreativeLab;
use App\Models\Concept;
use App\Models\SessionAuthor;
use App\Models\AboutMeditation;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function fetchAbout(Request $request)
    {
        $about = About::first();
        if (isset($about)) {
            $aboutInfo = $about->toArray();
        } else {
            $aboutInfo['title'] = '';
            $aboutInfo['description'] = '';
            $aboutInfo['cover_img'] = '';
        }

        $active = 'setting';
        return view('setting.detail_about', compact('active', 'aboutInfo'));
    }


    public function fetchSessions(Request $request)
    {
        $session = SessionAuthor::first();
        if (isset($session)) {
            $sessionInfo = $session->toArray();
        } else {
            $sessionInfo['title'] = '';
            $sessionInfo['description'] = '';
            $sessionInfo['cover_img'] = '';
        }

        $active = 'setting';
        return view('setting.session', compact('active', 'sessionInfo'));
    }

    public function fetchAboutSoul(Request $request)
    {
        $about = AboutSoul::first();
        if (isset($about)) {
            $aboutInfo = $about->toArray();
        } else {
            $aboutInfo['description'] = '';
        }

        $active = 'setting';
        return view('setting.detail_about_soul', compact('active', 'aboutInfo'));
    }

    public function saveAbout(Request $request)
    {
        $request->validate([
            'cover_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $about = About::first();

        if (isset($about)) {
            $about->title = $request->title;
            $about->description = $request->description;

            if (isset($request->cover_img)) {
                // delete existing file
                if (!empty($about->cover_img)) {
                    Storage::delete('public/about/' . $about->cover_img);
                }

                // save the image file
                $path = $request->cover_img->store('public/about');
                $paths = explode("/", $path);
                $about->cover_img = end($paths);
            }
        } else {
            $about = new About;

            $about->title = $request->title;
            $about->description = $request->description;

            if (isset($request->cover_img)) {
                // save the image file
                $path = $request->cover_img->store('public/about');
                $paths = explode("/", $path);
                $about->cover_img = end($paths);
            }
        }

        $about->save();

        return back()->with([
            'status' => 'success',
            'message' => 'About setting has been updated now.'
        ]);
    }

    public function saveSessions(Request $request)
    {
        $request->validate([
            'cover_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $session = SessionAuthor::first();

        if (isset($session)) {
            $session->title = $request->title;
            $session->description = $request->description;

            if (isset($request->cover_img)) {
                // delete existing file
                if (!empty($session->cover_img)) {
                    Storage::delete('public/sessions/' . $session->cover_img);
                }

                // save the image file
                $path = $request->cover_img->store('public/sessions');
                $paths = explode("/", $path);
                $session->cover_img = end($paths);
            }
        } else {
            $session = new SessionAuthor;

            $session->title = $request->title;
            $session->description = $request->description;

            if (isset($request->cover_img)) {
                // save the image file
                $path = $request->cover_img->store('public/sessions');
                $paths = explode("/", $path);
                $session->cover_img = end($paths);
            }
        }

        $session->save();

        return back()->with([
            'status' => 'success',
            'message' => 'Sessions with Paul setting has been updated now.'
        ]);
    }

    public function saveAboutSoul(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
        ]);

        $about = AboutSoul::first();

        if (isset($about)) {
            $about->description = $request->description;
        } else {
            $about = new AboutSoul;
            $about->description = $request->description;
        }

        $about->save();

        return back()->with([
            'status' => 'success',
            'message' => 'About Blended Soul setting has been updated now.'
        ]);
    }

    public function fetchCreative(Request $request)
    {
        $creative = CreativeLab::first();
        if (isset($creative)) {
            $creativeLab = $creative->toArray();
        } else {
            $creativeLab['description'] = '';
        }

        $active = 'setting';
        return view('setting.detail_creative', compact('active', 'creativeLab'));
    }

    public function saveCreative(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
        ]);

        $creative = CreativeLab::first();

        if (isset($creative)) {
            $creative->description = $request->description;
        } else {
            $creative = new CreativeLab;
            $creative->description = $request->description;
        }

        $creative->save();

        return back()->with([
            'status' => 'success',
            'message' => 'CreativeLab setting has been updated now.'
        ]);
    }

    public function fetchConcept(Request $request)
    {

        $active = 'setting';

        $concept = Concept::first();
        if (isset($concept)) {
            $conceptData = $concept->toArray();
        } else {
            $conceptData = ['description' => ''];
        }

        return view('setting.detail_concept', compact('active', 'conceptData'));
    }

    public function saveConcept(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
        ]);

        $concept = Concept::first();

        if (isset($concept)) {
            $concept->description = $request->description;
        } else {
            $concept = new Concept;
            $concept->description = $request->description;
        }

        $concept->save();

        return back()->with([
            'status' => 'success',
            'message' => 'Concept setting has been updated now.'
        ]);
    }

    public function fetchMeditation(Request $request)
    {
        $meditation = AboutMeditation::first();
        if (isset($meditation)) {
            $meditationData = $meditation->toArray();
        } else {
            $meditationData = ['description' => ''];
            $meditationData['title'] = '';
        }

        $active = 'setting';
        return view('setting.detail_meditation', compact('active', 'meditationData'));
    }

    public function saveMeditation(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'title' => 'required|string', 
        ]);

        $meditation = AboutMeditation::first();

        if (isset($meditation)) {
            $meditation->description = $request->description;
            $meditation->title = $request->title;
        } else {
            $meditation = new AboutMeditation;
            $meditation->description = $request->description;
            $meditation->title = $request->title;
        }

        $meditation->save();

        return back()->with([
            'status' => 'success',
            'message' => 'About Meditation setting has been updated now.'
        ]);
    }
}