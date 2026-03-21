<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;


class UserController extends Controller
{
    public function updateEmail(Request $request)
    {
        try {
            $user = Auth::user();
            $user->update([
                'email' => $request->email,
                'email_verified_at' => null
            ]);
            return response()->json($user);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to update user'], 500);
        }
    }


    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'user not found']);
            }
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'password incorect'], 401);
            }
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);
            return response()->json(['message' => 'the password changed successfuly'], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to update password'], 500);
        }
    }

    public function deleteUser()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'user not found']);
            }
            $cookie = Cookie::forget('access_token');
            if ($user->delete()) {
                return response()->json(['message' => 'the user deleted successfuly'])->withCookie($cookie);
            }
        } catch (JWTException $e) {

            return response()->json(['error' => 'Failed to delete user'], 500);
        }
    }
}
