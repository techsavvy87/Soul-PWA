<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\VerifyEmail;
use App\Models\VerifyPassword;
use App\Mail\VerifyRegister;
use App\Mail\VerifyResetPassword;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'The provided credentials are incorrect.',
                'results' => NULL
            ], 200);
        } else {
            if (empty($user->email_verified_at)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email has not been verified yet',
                    'results' => NULL
                ], 200);
            }

            $token = $user->createToken('Personal Access Token')->plainTextToken;

            // Check if the user has an active subscription
            $hasActiveSubscription = $user->planSubscriptions()
                ->where('current_period_end', '>', now())
                ->exists();

            $result = [
                'user'  => $user,
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'tier'         => $hasActiveSubscription ? 'Paid' : 'Free',
                'subscription' => $hasActiveSubscription,
            ];

            return response()->json([
                'status' => true,
                'message' => 'Login Successfully',
                'result' => $result
            ], 200);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => true,
            'message' => 'Logout Successfully',
            'result' => NULL
        ], 200);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'  => 'required|string',
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $name = $request->name;
        $email = $request->email;
        $password = $request->password;

        $existUser = User::where('email', $email)->exists();
        if ($existUser) {
            return response()->json([
                'status' => false,
                'message' => 'Email already exists',
                'results' => NULL
            ], 400);
        }

        $user = new User;
        $user->name = $name;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->save();

        $number = mt_rand(100000, 999999);
        $verifyEmail = new VerifyEmail;
        $verifyEmail->user_id = $user->id;
        $verifyEmail->number = $number;
        $verifyEmail->save();
        $mailData = [
            'verification_number' => $number
        ];
        Mail::to($email)->send(new VerifyRegister($mailData));

        return response()->json([
            'status' => true,
            'message' => 'The verification code has been sent to your email address.',
            'result' => $user->id
        ], 200);
    }

    public function verifyRegister(Request $request)
    {
        $request->validate([
            'userId'  => 'required',
            'code' => 'required',
        ]);

        $userId = $request->userId;
        $code = $request->code;

        $verifyEmail = VerifyEmail::where('number', $code)->where('user_id', $userId)->first();
        if (!isset($verifyEmail))
        {
            return response()->json(
                [
                    'status' => false,
                    'message' => 'Non-valid verification code',
                    'result' => null
                ],
                200
            );
        }
        $verifyEmail->delete();

        $user = User::find($userId);
        $user->email_verified_at = Carbon::now();
        $user->save();
        $result = [];
        if (!Auth::check()) {
            $tokenResult = $user->createToken('Personal Access Token');
            $token = $tokenResult->plainTextToken;

            $result['user_data'] =  [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'tier' => 'Free',
                'subscription' => false
            ];
            
            return response()->json([
                'status' => true,
                'message' => 'Register Successfully',
                'result' => $result
            ], 200);
        }

        return response()->json([
            'status' => false,
            'message' => 'Authentication with new account failed',
            'result' => null
        ], 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email'
        ]);

        $email = $request->email;
        $user = User::where('email', $email)->first();
        if (!isset($user))
        {
            return response()->json([
                'status' => false,
                'message' => "We can't find your account with this email.",
                'result' => null
            ], 200);
        }
        if (empty($user->email_verified_at)) {
            return response()->json([
                'status' => false,
                'message' => 'Email has not been verified yet',
                'results' => NULL
            ], 200);
        }

        $number = mt_rand(100000, 999999);
        $verifyPassword = new VerifyPassword;
        $verifyPassword->user_id = $user->id;
        $verifyPassword->number = $number;
        $verifyPassword->save();
        $mailData = [
            'verification_number' => $number
        ];
        Mail::to($email)->send(new VerifyResetPassword($mailData));

        return response()->json([
            'status' => true,
            'message' => "Verification code has been sent to your email address",
            'result' => $user->id
        ], 200);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'userId'  => 'required',
            'code' => 'required',
        ]);

        $userId = $request->userId;
        $code = $request->code;

        $verifyCode = VerifyPassword::where('number', $code)->where('user_id', $userId)->first();

        if (!isset($verifyCode))
        {
            return response()->json(
                [
                    'status' => false,
                    'message' => 'The verification is incorrect',
                    'result' => null
                ],
                200
            );
        }
        $verifyCode->delete();
        return response()->json([
            'status' => true,
            'message' => 'Register Successfully',
            'result' => $verifyCode->user_id
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'userId'  => 'required',
            'password' => 'required|string'
        ]);
        $userId = $request->userId;
        $password = $request->password;

        $user = User::find($userId);
        $user->password = Hash::make($password);
        $user->save();

        $token = $user->createToken('Personal Access Token')->plainTextToken;

        // Check if the user has an active subscription
        $hasActiveSubscription = $user->planSubscriptions()
            ->where('current_period_end', '>', now())
            ->exists();

        $result = [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'tier'         => $hasActiveSubscription ? 'Paid' : 'Free',
                'subscription' => $hasActiveSubscription,
            ];

        return response()->json([
            'status' => true,
            'message' => 'Your password is reset successfully.',
            'result' => $result
        ], 200);
    }
}