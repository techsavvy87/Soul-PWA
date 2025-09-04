<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Meditation;
use getID3;

class MeditationController extends Controller
{
    public function listMeditations(Request $request)
    {
        $getID3 = new getID3;
        $meditations = Meditation::where('status', 'published')->get();

        foreach($meditations as $meditation) {
            $meditation->cover_img_url = empty($meditation->cover_img) ? '' : asset('storage/meditations/' . $meditation->cover_img);
            $meditation->media_src_url = empty($meditation->media_src) ? '' : asset('storage/meditations/' . $meditation->media_src);

            if ($meditation->type === 'Audio' && !empty($meditation->media_src)) {
                $filePath = storage_path('app/public/meditations/' . $meditation->media_src);
                if (file_exists($filePath)) {
                    $fileInfo = $getID3->analyze($filePath);
                    if (isset($fileInfo['playtime_seconds'])) {
                        $seconds = (int) round($fileInfo['playtime_seconds']);
                        if ($seconds < 60) {
                            // Show pure seconds
                            $meditation->duration = $seconds . 's';
                        } elseif ($seconds < 3600) {
                            // Show mm:ss if under an hour
                            $meditation->duration = gmdate("i:s", $seconds);
                        } else {
                            // Show hh:mm:ss if 1 hour or more
                            $meditation->duration = gmdate("H:i:s", $seconds);
                        }
                    } else {
                        $meditation->duration = null;
                    }
                } else {
                    $meditation->duration = null;
                }
            } else {
                $meditation->duration = null;
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Listed the meditations successfully',
            'result' => $meditations
        ], 200);
    }

    public function getMeditationById($id)
    {
        $meditation = Meditation::find($id);
        if (!$meditation) {
            return response()->json([
                'status' => false,
                'message' => 'Meditation not found',
            ], 404);
        }

        $meditation->cover_img_url = empty($meditation->cover_img) ? '' : asset('storage/meditations/' . $meditation->cover_img);
        $meditation->media_src_url = empty($meditation->media_src) ? '' : asset('storage/meditations/' . $meditation->media_src);

        if ($meditation->type === 'Audio' && !empty($meditation->media_src)) {
            $filePath = storage_path('app/public/meditations/' . $meditation->media_src);
            if (file_exists($filePath)) {
                $getID3 = new getID3;
                $fileInfo = $getID3->analyze($filePath);
                if (isset($fileInfo['playtime_seconds'])) {
                    $seconds = (int) round($fileInfo['playtime_seconds']);
                    if ($seconds < 60) {
                        $meditation->duration = $seconds . 's';
                    } elseif ($seconds < 3600) {
                        $meditation->duration = gmdate("i:s", $seconds);
                    } else {
                        $meditation->duration = gmdate("H:i:s", $seconds);
                    }
                } else {
                    $meditation->duration = null;
                }
            } else {
                $meditation->duration = null;
            }
        } else {
            $meditation->duration = null;
        }

        return response()->json([
            'status' => true,
            'message' => 'Meditation retrieved successfully',
            'result' => $meditation
        ], 200);
    }
}