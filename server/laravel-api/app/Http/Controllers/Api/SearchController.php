<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function search(Request $request)
    {

        $q = $request->query('s');

        $ids = Profile::search($q)
            ->take(20)
            ->keys();

        $profiles = Profile::whereIn('profile_id', $ids)
            ->where('user_id', '!=', Auth::id())
            ->take(5)
            ->get();

        return response()->json($profiles);
    }

    public function searchResults(Request $request)
    {
        $query = $request->query('s');
        if (empty($query)) {
            return response()->json([]);
        }

        $authId = Auth::id();

        $hashtags = DB::table('hashtags')
            ->where('tag', 'like', "%{$query}%")
            ->select('hashtag_id', 'tag')
            ->limit(5)
            ->get();


        $posts = DB::table('posts')
            ->join('profiles', 'posts.author_id', '=', 'profiles.user_id')
            ->leftJoin('follows', function ($join) use ($authId) {
                $join->on('profiles.user_id', '=', 'follows.followed_id')
                    ->where('follows.follower_id', $authId);
            })
            ->leftJoin('media', 'posts.post_id', '=', 'media.post_id')
            ->leftJoin('likes', 'posts.post_id', '=', 'likes.post_id')
            ->leftJoin('comments', 'posts.post_id', '=', 'comments.post_id')
            ->leftJoin('likes as user_like', function ($join) use ($authId) {
                $join->on('posts.post_id', '=', 'user_like.post_id')
                    ->where('user_like.user_id', $authId);
            })
            ->where('posts.content', 'like', "%{$query}%")
            ->where(function ($q) {
                $q->where('profiles.is_private', false)
                    ->orWhereNotNull('follows.follow_id');
            })
            ->select(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at',
                DB::raw('COUNT(DISTINCT likes.like_id) as likes_count'),
                DB::raw('COUNT(DISTINCT comments.comment_id) as comments_count'),
                DB::raw('CASE WHEN MAX(user_like.like_id) IS NOT NULL THEN true ELSE false END as user_has_liked'),
                DB::raw('IF(COUNT(media.media_id), JSON_ARRAYAGG(JSON_OBJECT(
                "media_id", media.media_id,
                "url", media.url,
                "type", media.type,
                "size", media.size,
                "mime_type", media.mime_type
            )), JSON_ARRAY()) as media')
            )
            ->groupBy('posts.post_id', 'posts.content', 'posts.author_id', 'profiles.display_name', 'profiles.avatar_url', 'posts.created_at', 'posts.updated_at')
            ->latest()
            ->limit(5)
            ->get();

        $profiles = DB::table('profiles')
            ->leftJoin('follows as my_follow', function ($join) use ($authId) {
                $join->on('profiles.user_id', '=', 'my_follow.followed_id')
                    ->where('my_follow.follower_id', $authId);
            })
            ->where('profiles.display_name', 'like', "%{$query}%")
            ->orWhere('profiles.bio', 'like', "%{$query}%")
            ->where(function ($q) {
                $q->where('profiles.is_private', false)
                    ->orWhereNotNull('my_follow.follow_id');
            })
            ->select(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url',
                DB::raw('CASE WHEN my_follow.follow_id IS NOT NULL THEN true ELSE false END as has_followed')
            )
            ->limit(5)
            ->get();

        return response()->json([
            'hashtags' => $hashtags,
            'posts' => $posts,
            'profiles' => $profiles
        ]);
    }

    public function postsResults(Request $request)
    {
        $query = $request->query('s');
        if (empty($query)) {
            return response()->json([]);
        }
        $authId = Auth::id();
        $posts = DB::table('posts')
            ->join('profiles', 'posts.author_id', '=', 'profiles.user_id')
            ->leftJoin('follows', function ($join) use ($authId) {
                $join->on('profiles.user_id', '=', 'follows.followed_id')
                    ->where('follows.follower_id', $authId);
            })
            ->leftJoin('media', 'posts.post_id', '=', 'media.post_id')
            ->leftJoin('likes', 'posts.post_id', '=', 'likes.post_id')
            ->leftJoin('comments', 'posts.post_id', '=', 'comments.post_id')
            ->leftJoin('likes as user_like', function ($join) use ($authId) {
                $join->on('posts.post_id', '=', 'user_like.post_id')
                    ->where('user_like.user_id', $authId);
            })
            ->where('posts.content', 'like', "%{$query}%")
            ->where(function ($q) {
                $q->where('profiles.is_private', false)
                    ->orWhereNotNull('follows.follow_id');
            })
            ->select(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at',
                DB::raw('COUNT(DISTINCT likes.like_id) as likes_count'),
                DB::raw('COUNT(DISTINCT comments.comment_id) as comments_count'),
                DB::raw('CASE WHEN MAX(user_like.like_id) IS NOT NULL THEN true ELSE false END as user_has_liked'),
                DB::raw('IF(COUNT(media.media_id), JSON_ARRAYAGG(JSON_OBJECT(
                "media_id", media.media_id,
                "url", media.url,
                "type", media.type,
                "size", media.size,
                "mime_type", media.mime_type
            )), JSON_ARRAY()) as media')
            )
            ->groupBy('posts.post_id', 'posts.content', 'posts.author_id', 'profiles.display_name', 'profiles.avatar_url', 'posts.created_at', 'posts.updated_at')
            ->latest()
            ->paginate(10);

        return response()->json($posts);
    }

    public function profilesResult(Request $request)
    {

        $query = $request->query('s');
        if (empty($query)) {
            return response()->json([]);
        }
        $authId = Auth::id();
        $profiles = DB::table('profiles')
            ->leftJoin('follows as my_follow', function ($join) use ($authId) {
                $join->on('profiles.user_id', '=', 'my_follow.followed_id')
                    ->where('my_follow.follower_id', $authId);
            })
            ->where(function ($q) use ($query) {
                $q->where('profiles.display_name', 'like', "%{$query}%")
                    ->orWhere('profiles.bio', 'like', "%{$query}%");
            })
            ->where(function ($q) { 
                $q->where('profiles.is_private', false)
                    ->orWhereNotNull('my_follow.follow_id');
            })

            ->select(
                'profiles.user_id',
                'profiles.display_name',
                'profiles.avatar_url',
                DB::raw('CASE WHEN my_follow.follow_id IS NOT NULL THEN true ELSE false END as has_followed')
            )
            ->paginate(10);

        return response()->json($profiles);
    }
}
