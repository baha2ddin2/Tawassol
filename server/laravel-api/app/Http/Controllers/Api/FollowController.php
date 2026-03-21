<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class FollowController extends Controller
{
    public function getFollowing()
    {
        $authId = Auth::id();

        $following = DB::table('follows')
            ->join('profiles', 'follows.followed_id', '=', 'profiles.user_id')
            ->where('follows.follower_id', $authId)
            ->select(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'profiles.is_private',
                DB::raw('true as has_followed'),
                'follows.created_at as followed_at'
            )
            ->get();

        return response()->json($following);
    }

    public function getFollowingById(string $userId)
    {
        $following = DB::table('follows')
            ->join('profiles', 'follows.followed_id', '=', 'profiles.user_id')
            ->where('follows.follower_id', $userId)
            ->select(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'profiles.is_private',
                DB::raw('true as has_followed'),
                'follows.created_at as followed_at'
            )
            ->get();

        return response()->json($following);
    }

    public function getFollowers()
    {
        $authId = Auth::id();

        $followers = DB::table('follows')
            ->join('profiles', 'follows.follower_id', '=', 'profiles.user_id')
            ->leftJoin('follows as my_follow', function ($join) use ($authId) {
                $join->on('profiles.user_id', '=', 'my_follow.followed_id')
                    ->where('my_follow.follower_id', '=', $authId);
            })
            ->where('follows.followed_id', $authId)
            ->select(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'profiles.is_private',
                DB::raw('CASE WHEN my_follow.follow_id IS NOT NULL THEN true ELSE false END as has_followed'),
                'follows.created_at as followed_at'
            )
            ->get();

        return response()->json($followers);
    }

    public function getFollowersById(string $userId)
    {
        $authId = Auth::id();

        $followers = DB::table('follows')
            ->join('profiles', 'follows.follower_id', '=', 'profiles.user_id')
            ->leftJoin('follows as my_follow', function ($join) use ($authId) {
                $join->on('profiles.user_id', '=', 'my_follow.followed_id')
                    ->where('my_follow.follower_id', '=', $authId);
            })
            ->where('follows.followed_id', $userId)
            ->select(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'profiles.is_private',
                DB::raw('CASE WHEN my_follow.follow_id IS NOT NULL THEN true ELSE false END as has_followed'),
                'follows.created_at as followed_at'
            )
            ->get();

        return response()->json($followers);
    }
    public function smartSuggestions()
    {
        $authId = Auth::id();

        $suggestions = DB::table('follows as f1')
            ->join('follows as f2', 'f1.followed_id', '=', 'f2.follower_id')
            ->join('profiles', 'f2.followed_id', '=', 'profiles.user_id')
            ->where('f1.follower_id', $authId)
            ->where('f2.followed_id', '!=', $authId)
            ->whereNotIn('f2.followed_id', function ($query) use ($authId) {
                $query->select('followed_id')
                    ->from('follows')
                    ->where('follower_id', $authId);
            })
            ->select(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url',
                DB::raw('COUNT(*) as mutual_count')
            )
            ->groupBy(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url'
            )
            ->orderByDesc('mutual_count')
            ->limit(10)
            ->get();

        return response()->json($suggestions);
    }

    public function suggestions()
    {
        $authId = Auth::id();
        $suggestions = DB::table('profiles')
            ->leftJoin('follows as my_follow', function ($join) use ($authId) {
                $join->on('profiles.user_id', '=', 'my_follow.followed_id')
                    ->where('my_follow.follower_id', '=', $authId);
            })
            ->where('profiles.user_id', '!=', $authId)
            ->whereNull('my_follow.follow_id')
            ->select(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'profiles.is_private',
                DB::raw('false as has_followed')
            )
            ->limit(10)
            ->get();

        return response()->json($suggestions);
    }

    public function follow(string $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'user not found'], 404);
        }
        if ($user->user_id == Auth::id()) {
            return response()->json(['message' => 'you cannot follow your self']);
        }
        $isfollow = DB::table('users')
            ->join('follows', 'follows.followed_id', '=', 'users.user_id')
            ->where('followed_id', $userId)
            ->where('follower_id', Auth::id())
            ->first();
        if ($isfollow) {
            return response()->json(['message' => 'you already follow this user'], 401);
        }
        $follow = Follow::create([
            'follow_id' => Str::uuid(),
            'follower_id' => Auth::id(),
            'followed_id' => $userId
        ]);

        if($follow){
            notification::create([
                'notification_id'=>Str::uuid(),
                'type'=>'follow',
                'source_user_id'=>Auth::id(),
                'user_id'=>$userId
            ]);
        }

        return response()->json(['message' => 'the follow created successfuly'], 201);
    }

    public function unfollow(string $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'user not found'], 404);
        }
        $isfollow = DB::table('users')
            ->join('follows', 'follows.followed_id', '=', 'users.user_id')
            ->where('followed_id', $userId)
            ->where('follower_id', Auth::id())
            ->first();
        if (!$isfollow) {
            return response()->json(['message' => 'you not follow this user'], 401);
        }
        $follow = Follow::find($isfollow->follow_id);
        if (!$follow) {
            return response()->json(['message' => 'follow not found'], 404);
        }
        $follow->delete();

        return response()->json(['message' => 'this follow deleted successfuly']);
    }
}
