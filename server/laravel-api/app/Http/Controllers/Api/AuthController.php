<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Profile;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
    
        $user = User::create([
            'user_id' => Str::uuid(),
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $filename = null;
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $mediaId = Str::uuid();
            $manager = new ImageManager(new Driver());
            $filename = 'avatar/' . $mediaId . '.webp';
            $image = $manager->read($file)
                ->scale(width: 1080)
                ->toWebp(80);
            Storage::disk('public')->put($filename, $image);
        }

        $profile = Profile::create([
            'profile_id' => Str::uuid(),
            'display_name' => $request->name,
            'avatar_url' => $filename,
            'user_id' => $user->user_id
        ]);

        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token', 'message' => $e], 500);
        }
        return $this->ResponseWithCookie($token, ['user' => $user, 'profile' => $profile], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token', 'message' => $e], 500);
        }

        return $this->ResponseWithCookie($token, 'login succes', 200);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to logout, please try again'], 500);
        }
        $cookie = Cookie::forget('access_token');
        return response()->json(['message' => 'Successfully logged out'])->withCookie($cookie);
    }

    public function checkAuth()
    {
        $profile = DB::table('profiles')->where('user_id',Auth::id())->first();
        return response()->json([
            'message' => 'user authenticated successfully',
            'user' => Auth::user(),
            'profile'=> $profile
        ], 200);
    }



    protected function ResponseWithCookie($token, $message ,$status)
    {
        return response()->json([
            'message' => $message
        ], $status)->cookie(
            'access_token',
            $token,
            240000,
            '/',
            null,
            false,
            true,
            false,
            'lax'
        );
    }
}
