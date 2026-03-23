<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\changeAvatarRequest;
use App\Http\Requests\changePrivacyRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProfileController extends Controller
{
    public function MyProfile()
    {
        // $profile = DB::table('profiles')
        // ->join('users','users.id','=','profiles.user_id')
        // ->where('users.id','=',Auth::id())
        // ->select('users.id as user_id',
        // 'users.name',
        // 'profiles.display_name as display_name'
        // ,'profiles.bio as bio',
        // )->get();

        $profile = DB::table('users')
            ->join('profiles', 'users.user_id', '=', 'profiles.user_id')
            ->leftJoin('follows as f1', 'users.user_id', '=', 'f1.followed_id')
            ->leftJoin('follows as f2', 'users.user_id', '=', 'f2.follower_id')
            ->leftJoin('posts as p', 'p.author_id', 'users.user_id')
            ->where('users.user_id', '=', Auth::user()->user_id)
            ->select(
                'profiles.avatar_url',
                'profiles.display_name',
                'profiles.bio',
                DB::raw('COUNT(DISTINCT f1.follow_id) as followers_count'),
                DB::raw('COUNT(DISTINCT f2.follow_id) as following_count'),
                DB::raw('COUNT(DISTINCT p.post_id) as posts_count'),
            )->groupBy(
                'profiles.avatar_url',
                'profiles.display_name',
                'profiles.bio'
            )->first();

        return response()->json($profile);
    }

       public function ShowProfile(string $id)
    {
        $authUserId = Auth::id();

        $profile = DB::table('users')
            ->join('profiles', 'users.user_id', '=', 'profiles.user_id')
            ->where('users.user_id', $id)
            ->select(
                'profiles.avatar_url as avatar_url',
                'profiles.display_name as display_name',
                'profiles.bio as bio',
                'users.user_id',
                'profiles.is_private'
            )
            // Use subselects to count efficiently without needing GROUP BY or DISTINCT
            ->selectRaw('(SELECT COUNT(*) FROM follows WHERE followed_id = users.user_id) as followers_count')
            ->selectRaw('(SELECT COUNT(*) FROM follows WHERE follower_id = users.user_id) as following_count')
            ->selectRaw('(SELECT COUNT(*) FROM posts WHERE author_id = users.user_id) as posts_count')
            // Pass the binding directly into selectRaw
            ->selectRaw('EXISTS(SELECT 1 FROM follows WHERE follower_id = ? AND followed_id = users.user_id) as is_following', [$authUserId])
            ->first();

        if (!$profile) {
            return response()->json(['message' => 'profile not found'], 404);
        }

        // is_following returns as 1 or 0 from MySQL, cast it to boolean for the JSON response
        $profile->is_following = (bool) $profile->is_following; 

        return response()->json($profile);
    }



    public function updateProfile(UpdateProfileRequest $request)
    {
        try {
            $profile = Profile::where('user_id', '=', Auth::id())->first();

            if (!$profile) {
                return response()->json(['message' => 'profile not found'], 404);
            }

            $profile->update($request->validated());

            return response()->json([
                'message' => 'Profile updated successfuly',
                'profile' => $profile
            ]);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to update profile'], 500);
        }
    }

    public function updateAvatar(changeAvatarRequest $request)
    {

        try {
            if (!$request->hasFile('avatar')) {
                return response()->json(['message' => 'No file provided'], 400);
            }
            $file = $request->file('avatar');
            if ($file) {
                $mediaId = Str::uuid();
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file)
                    ->scale(width: 1080)
                    ->toWebp(80);
                $filename = 'posts/' . $mediaId . '.webp';
                Storage::disk('public')->put($filename, $image);
            }


            $profile = Profile::where('user_id', '=', Auth::id())->first();

            if (!$profile) {
                return response()->json(['message' => 'profile not found'], 404);
            }

            $profile->update(['avatar_url' => $filename]);
            return response()->json(['message' => 'avatar updated successfuly']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to update avatar'], 500);
        }
    }
    public function changePrivacy(changePrivacyRequest $request)
    {

        $profile = DB::table('profiles')
            ->where('user_id', Auth::id())
            ->update([
                'is_private' => $request->is_private
            ]);

        return response()->json([
            'message' => 'Privacy updated successfully',
            'is_private' => (bool) $request->is_private
        ]);
    }
}
