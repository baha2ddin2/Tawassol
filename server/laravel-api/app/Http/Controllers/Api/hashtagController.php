<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\hashtag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class hashtagController extends Controller
{
    public function getPostsByHashtag(Request $request, string $tag)
    {
        $authId = Auth::id();

        $hashtag = DB::table('hashtags')
            ->where('tag', $tag)
            ->first();

        if (!$hashtag) {
            return response()->json(['message' => 'Hashtag not found'], 404);
        }

        $posts = DB::table('post_hashtags as ph')
            ->join('posts', 'ph.post_id', '=', 'posts.post_id')
            ->join('profiles', 'posts.author_id', '=', 'profiles.user_id')
            ->leftJoin('follows', function ($join) use ($authId) {
                $join->on('posts.author_id', '=', 'follows.followed_id')
                    ->where('follows.follower_id', '=', $authId);
            })
            ->leftJoin('media', 'posts.post_id', '=', 'media.post_id')
            ->leftJoin('likes', 'posts.post_id', '=', 'likes.post_id')
            ->leftJoin('comments', 'posts.post_id', '=', 'comments.post_id')
            ->leftJoin('likes as user_like', function ($join) use ($authId) {
                $join->on('posts.post_id', '=', 'user_like.post_id')
                    ->where('user_like.user_id', '=', $authId);
            })
            ->where('ph.hashtag_id', $hashtag->hashtag_id)
            ->where(function ($q) use ($authId) {
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
                DB::raw('CASE WHEN ANY_VAlUE(user_like.like_id) IS NOT NULL THEN true ELSE false END as user_has_liked'),
                DB::raw('JSON_ARRAYAGG(JSON_OBJECT(
                "media_id", media.media_id,
                "url", media.url,
                "type", media.type,
                "size", media.size,
                "mime_type", media.mime_type
            )) as media')
            )
            ->groupBy(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at'
            )
            ->orderBy('posts.created_at', 'desc')
            ->paginate(10);

        return response()->json($posts);
    }

    public function countAllPostsByHashtag(string $tag)
    {

        $hashtag = DB::table('hashtags')
            ->where('tag', $tag)
            ->first();

        if (!$hashtag) {
            return response()->json(['message' => 'Hashtag not found'], 404);
        }

        $count = DB::table('post_hashtags as ph')
            ->join('posts', 'ph.post_id', '=', 'posts.post_id')
            ->where('ph.hashtag_id', $hashtag->hashtag_id)
            ->distinct('posts.post_id')
            ->count('posts.post_id');

        return response()->json([
            'hashtag' => $tag,
            'total_posts' => $count
        ]);
    }
    public function topHashtagsWeek()
    {
        $startDate = now()->subDays(7);
        $endDate = now();

        $topHashtags = DB::table('post_hashtags as ph')
            ->join('posts', 'ph.post_id', '=', 'posts.post_id')
            ->join('hashtags', 'ph.hashtag_id', '=', 'hashtags.hashtag_id')
            ->whereBetween('posts.created_at', [$startDate, $endDate])
            ->select(
                'hashtags.tag',
                DB::raw('COUNT(DISTINCT ph.post_id) as posts_count')
            )
            ->groupBy('hashtags.hashtag_id', 'hashtags.tag')
            ->orderByDesc('posts_count')
            ->limit(10)
            ->get();

        return response()->json($topHashtags);
    }
}
