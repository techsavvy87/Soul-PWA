<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\NotificationToggle;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function subscribe(Request $request)
    {
        $endpoint = $request->endpoint;
        $key = $request->keys['p256dh'];
        $token = $request->keys['auth'];

        $user = User::find(Auth::id());
        $user->updatePushSubscription($endpoint, $key, $token);

        $notificationToggle = NotificationToggle::where('user_id', Auth::id())->first();
        if (isset($notificationToggle)) {
            $notificationToggle->status = 'enabled';
        } else {
            $notificationToggle = new NotificationToggle;
            $notificationToggle->user_id = Auth::id();
            $notificationToggle->status = 'enabled';
        }
        $notificationToggle->save();

        return response()->json([
            'status' => true,
            'message' => 'Updated the subscription successfully',
            'result' => $user->id
        ], 200);
    }
}