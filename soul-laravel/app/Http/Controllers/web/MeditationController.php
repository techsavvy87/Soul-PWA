<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Meditation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Vimeo\Laravel\Facades\Vimeo;


class MeditationController extends Controller
{
    public function listMeditations(Request $request)
    {
        $meditations = Meditation::all();

        $active = 'meditation';
        return view('meditation.list', compact('active', 'meditations'));
    }

    public function addMeditation(Request $request)
    {
        $active = 'meditation';
        return view('meditation.create', compact('active'));
    }

    public function createMeditation(Request $request)
    {
        $request->validate([
            'cover_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'media_src' => 'file|mimes:mp4,avi,mkv,flv,mp3,wav|max:409600',
            'title' => 'required|string',
            'status' => 'required|string',
        ]);

        $type = 'Audio';

        $meditation = new Meditation;
        $meditation->title = $request->title;
        $meditation->description = $request->description;
        $meditation->type = $type;
        $meditation->status = $request->status;

        if ($request->status === 'published')
            $meditation->published_at = Carbon::now();

        if ($type !== 'Text' && isset($request->media_src)) {
            $file = $request->file('media_src');
            $mimeType = $file->getClientMimeType();
            $fileName = $file->getClientOriginalName();

            if (($type === 'Audio' && strstr($mimeType, "video/")) || ($type === 'Video' && strstr($mimeType, "audio/")))
                return back()->with([
                    'status' => 'fail',
                    'message' => "Media Source file doesn't match with its type"
                ]);

            $path = $request->media_src->store('public/meditations');
            $paths = explode("/", $path);
            $meditation->media_src = end($paths);
            $meditation->media_original_name = $fileName;
        }

        if (isset($request->cover_img))
        {
            // save the image file
            $path = $request->cover_img->store('public/meditations');
            $paths = explode("/", $path);
            $meditation->cover_img = end($paths);
        }

        $meditation->save();

        if ($type === 'Video' && isset($request->media_src))
            $this->uploadmeditationVideo();

        return redirect()->route('list-meditation')->with([
            'status'=>'success',
            'message'=> 'Meditation has been created successfully.',
        ]);
    }

    public function editMeditation($id)
    {
        $meditation = Meditation::find($id);
        $active = 'meditation';

        return view('meditation.update', compact('active', 'meditation'));
    }

    public function updateMeditation(Request $request)
    {
        
        $request->validate([
            'id' => 'required',
            'title' => 'required|string',
            'cover_img' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'media_src' => 'file|mimes:mp4,avi,mkv,flv,mp3,wav|max:409600',
            'status' => 'required|string'
        ]);

        $meditation = Meditation::find($request->id);

        $meditation->title = $request->title;
        $meditation->description = $request->description;

        $type = 'Audio';
        $meditation->type = $type;

        if ($type !== 'Text') {
            if (isset($request->media_src)) {
                $file = $request->file('media_src');
                $mimeType = $file->getClientMimeType();
                $fileName = $file->getClientOriginalName();

                if (($type === 'Audio' && strstr($mimeType, "video/")) || ($type === 'Video' && strstr($mimeType, "audio/")))
                    return back()->with([
                        'status' => 'fail',
                        'message' => "Media Source file doesn't match with its type"
                    ]);

                if (!empty($meditation->media_src)) {
                    Storage::delete('public/meditations/' . $meditation->media_src);
                }

                $path = $request->media_src->store('public/meditations');
                $paths = explode("/", $path);
                $meditation->media_src = end($paths);
                $meditation->media_original_name = $fileName;
            }
        } else {
            if (!empty($meditation->media_src)) {
                Storage::delete('public/meditations/' . $meditation->media_src);
            }
            $meditation->media_src = NULL;
            $meditation->media_original_name = NULL;
        }

        if (isset($request->cover_img)) {
            if (!empty($meditation->cover_img)) {
                Storage::delete('public/meditations/' . $meditation->cover_img);
            }

            $path = $request->cover_img->store('public/meditations');
            $paths = explode("/", $path);
            $meditation->cover_img = end($paths);
        }

        if ($request->status != $meditation->status) {
            if ($request->status === 'published')
                $meditation->published_at = Carbon::now();
            else
                $meditation->published_at = NULL;
        }
        $meditation->status = $request->status;

        $meditation->save();

        if ($type === 'Video' && isset($request->media_src))
            $this->uploadMeditationVideo();

        return redirect()->route('list-meditation')->with([
            'status'=>'success',
            'message'=> 'Meditation has been updated successfully.',
        ]);
    }

    public function deleteMeditation(Request $request)
    {
        $request->validate([
            'meditation_id' => 'required',
        ]);


        $meditation = Meditation::find($request->meditation_id);
        if (!empty($meditation->cover_img)) {
            Storage::delete('public/meditations/' . $meditation->cover_img);
        }
        if (!empty($meditation->media_src)) {
            Storage::delete('public/meditations/' . $meditation->media_src);
        }
        if (!empty($meditation->vimeo_id)) {
            Vimeo::request("/videos/" . $meditation->vimeo_id, [], "DELETE");
        }

        $meditation->delete();

        return redirect()->route('list-meditation')->with([
            'status'=>'success',
            'message'=> 'meditation has been deleted successfully.',
        ]);
    }

    protected function uploadMeditationVideo()
    {
        $videoMeditations = Meditation::where('type', 'Video')->whereNotNull('media_src')->get();

        foreach($videoMeditations as $videoMeditation) {
            if (isset($videoMeditation->media_src)) {
                if (isset($videoMeditation->vimeo_id)) {
                    Vimeo::request("/videos/".$videoMeditation->vimeo_id, [], "DELETE");
                }

                $videoPath = Storage::path('public/meditations/' . $videoMeditation->media_src);

                $vimeoVideoLink = Vimeo::upload($videoPath, [
                    'name' =>  $videoMeditation->title,
                    'description' => $videoMeditation->description
                ]);

                $linkParts = explode('/', $vimeoVideoLink);
                $vimeoVideoId = $linkParts[count($linkParts)-1];

                Storage::delete('public/meditations/' . $videoMeditation->media_src);

                $videoMeditation->media_src = NULL;
                $videoMeditation->vimeo_id = $vimeoVideoId;
                $videoMeditation->save();
            }
        }
    }
}