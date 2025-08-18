<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\VerifyEmail;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login()
    {
        return view('auth.login');
    }

    public function postLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $rememberMe = $request->remember_me;
        $remember = $rememberMe === 'on' ? TRUE : FALSE;

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            if (Auth::user()->role !== 'admin')
                return back()->with([
                    'status' => 'fail',
                    'message' => 'You are required to get an administrator access.'
                ]);

            return redirect()->route('dashboard');
        }

        return back()->with([
            'status' => 'fail',
            'message' => 'Your credential is incorrect.'
        ]);
    }

    

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }
}