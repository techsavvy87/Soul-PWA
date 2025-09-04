<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reading;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendReading;

class ReadingController extends Controller
{
    public function listReadings()
    {
        $minCount = 4;
        $total = Reading::count();
        $takeCount = rand($minCount, max($minCount, $total));
        $randomCount = rand($minCount, $total); // random number of readings
        $readings = Reading::inRandomOrder()->limit($takeCount)->get();

        return response()->json([
            'status' => true,
            'total_readings' => $readings->count(),
            'data' => $readings,
        ]);
    }

    public function getReadingById($id)
    {
        $reading = Reading::find($id);
        
        if (!$reading) {
            return response()->json(['status' => false, 'message' => 'Reading not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $reading]);
    }

    public function sendReadingEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'readingUrl' => 'required|string',
        ]);

        $email = $request->email;
        $readingUrl = $request->readingUrl;

        $mailData = [
            'readingUrl' => $readingUrl
        ];

        Mail::to($email)->send(new SendReading($mailData));

        return response()->json([
            'status' => true,
            'message' => "Reading has been sent to {$email}.",
        ]);
    }
}