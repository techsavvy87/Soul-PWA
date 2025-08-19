<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\User;
use App\Notifications\WebPushNotification;

class NotificationController extends Controller
{
    public function send($id)
    {
        $notification = Notification::find($id);

        $users = User::where('role', 'user')->get();
        foreach ($users as $user) {
            $user->notify(new WebPushNotification($notification));
        }

        $notification->status = 'sent';
        $notification->save();

        return back()->with([
            'status' => 'success',
            'message' => "Notification has been sent to users."
        ]);
    }

    public function list(Request $request)
    {
        $notifications = Notification::all();
        $active = 'notification';
        return view('notification.list', compact('active', 'notifications'));
    }

    public function add(Request $request)
    {
        $active = 'notification';
        return view('notification.create', compact('active'));
    }

    public function create(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $notification = new Notification;
        $notification->title = $request->title;
        $notification->description = $request->description;

        $notification->save();

        return redirect()->route('list-notification')->with([
            'status'=>'success',
            'message'=> 'Notification has been created successfully.',
        ]);
    }

    public function edit($id)
    {
        $notification = Notification::find($id);

        $active = 'notification';
        return view('notification.update', compact('notification', 'active'));
    }

    public function delete(Request $request) {
        $request->validate([
            'notification_id' => 'required',
        ]);

        $id = $request->notification_id;

        $notification = Notification::find($id);
        $notification->delete();

        return redirect()->route('list-notification')->with([
            'status'=>'success',
            'message'=> 'Notification has been deleted successfully.',
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $id = $request->notification_id;
        $notification = Notification::find($id);
        $notification->title = $request->title;
        $notification->description = $request->description;

        $notification->save();

        return redirect()->route('list-notification')->with([
            'status'=>'success',
            'message'=> 'Notification has been updated successfully.',
        ]);
    }
}