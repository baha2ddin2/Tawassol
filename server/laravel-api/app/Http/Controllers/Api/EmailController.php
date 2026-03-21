<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\verifyEmailRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendConfirmEmailCode;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EmailController extends Controller
{

    public function sendCode()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        $code = rand(100000, 999999);

        $user->update([
            'email_validation_code' => $code,
            'validate_code_expired_at' => now()->addMinutes(10)
        ]);

        Mail::to($user->email)->send(new SendConfirmEmailCode($code));

        return response()->json(['message' => 'Verification code sent successfully']);
    }


    public function verifyEmail(verifyEmailRequest $request)
    {
        $request->validate(['code'  => 'required|string']);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        if ($user->email_validation_code !== $request->code) {
            return response()->json([
                'message' => 'Invalid verification code'
            ], 400);
        }

        if (Carbon::now()->gt($user->validate_code_expired_at)) {
            return response()->json([
                'message' => 'Verification code expired'
            ], 400);
        }

        $user->update([
            'email_verified_at' => now(),
            'email_validation_code' => null,
            'validate_code_expired_at' => null
        ]);

        return response()->json([
            'message' => 'Email verified successfully'
        ]);
    }

}
