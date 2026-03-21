<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\createPostRequest;
use App\Http\Requests\updatePostRequest;
use App\Models\Follow;
use App\Models\notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Models\Post;


class PostController extends Controller
{
    public function profilePosts()
    {
        $authId = Auth::id();
        $posts = DB::table('posts')
            ->join('profiles', 'posts.author_id', '=', 'profiles.user_id')
            ->leftJoin('likes', 'posts.post_id', '=', 'likes.post_id')
            ->leftJoin('likes as user_like', function ($join) use ($authId) {
                $join->on('posts.post_id', '=', 'user_like.post_id')
                    ->where('user_like.user_id', '=', $authId);
            })
            ->leftJoin('comments', 'posts.post_id', '=', 'comments.post_id')
            ->where('posts.author_id', $authId)
            ->select(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'posts.external_link',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at',
                DB::raw('COUNT(DISTINCT likes.like_id) as likes_count'),
                DB::raw('COUNT(DISTINCT comments.comment_id) as comments_count'),
                DB::raw('MAX(CASE WHEN user_like.like_id IS NOT NULL THEN 1 ELSE 0 END) as user_has_liked'),
                DB::raw(
                    '(SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
                    "media_id", m.media_id,
                    "url", m.url,
                    "type", m.type,
                    "size", m.size,
                    "mime_type", m.mime_type
                )),JSON_ARRAY())
                FROM media m
                WHERE m.post_id = posts.post_id
                ) as media'
                )
            )
            ->groupBy(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'posts.external_link',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at'
            )
            ->latest('posts.created_at')
            ->paginate(10);

        return response()->json($posts);
    }

    public function userPost(string $id)
    {
        $authId = Auth::id();

        $profile = DB::table('profiles')->where('user_id', $id)->first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        if ($profile->is_private && $authId != $id) {
            $isFollowing = DB::table('follows')
                ->where('follower_id', $authId)
                ->where('followed_id', $id)
                ->exists();

            if (!$isFollowing) {
                return response()->json(['message' => 'This account is private'], 403);
            }
        }

        $posts = DB::table('posts')
            ->join('profiles', 'posts.author_id', '=', 'profiles.user_id')
            ->leftJoin('likes', 'posts.post_id', '=', 'likes.post_id')
            ->leftJoin('likes as user_like', function ($join) use ($authId) {
                $join->on('posts.post_id', '=', 'user_like.post_id')
                    ->where('user_like.user_id', '=', $authId);
            })
            ->leftJoin('comments', 'posts.post_id', '=', 'comments.post_id')
            ->where('posts.author_id', $id)
            ->select(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'posts.external_link',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at',
                DB::raw('COUNT(DISTINCT likes.like_id) as likes_count'),
                DB::raw('COUNT(DISTINCT comments.comment_id) as comments_count'),
                DB::raw('MAX(CASE WHEN user_like.like_id IS NOT NULL THEN 1 ELSE 0 END) as user_has_liked'),
                DB::raw(
                    '(SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
                    "media_id", m.media_id,
                    "url", m.url,
                    "type", m.type,
                    "size", m.size,
                    "mime_type", m.mime_type
                )),JSON_ARRAY())
                FROM media m
                WHERE m.post_id = posts.post_id
                ) as media'
                )
            )
            ->groupBy(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'posts.external_link',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at'
            )
            ->latest('posts.created_at')
            ->paginate(10);

        return response()->json($posts);
    }

    public function homePosts()
    {
        $authId = Auth::id();

        $posts = DB::table('posts')
            ->join('profiles', 'posts.author_id', '=', 'profiles.user_id')
            ->leftJoin('follows', function ($join) use ($authId) {
                $join->on('posts.author_id', '=', 'follows.followed_id')
                    ->where('follows.follower_id', '=', $authId);
            })
            ->leftJoin('likes', 'posts.post_id', '=', 'likes.post_id')
            ->leftJoin('likes as user_like', function ($join) use ($authId) {
                $join->on('posts.post_id', '=', 'user_like.post_id')
                    ->where('user_like.user_id', '=', $authId);
            })
            ->leftJoin('comments', 'posts.post_id', '=', 'comments.post_id')
            ->where('posts.author_id', '!=', $authId)
            ->where(function ($query) {
                $query->where('profiles.is_private', false)
                    ->orWhereNotNull('follows.follow_id');
            })
            ->select(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'posts.external_link',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at',
                DB::raw('COUNT(DISTINCT likes.like_id) as likes_count'),
                DB::raw('COUNT(DISTINCT comments.comment_id) as comments_count'),
                DB::raw('MAX(CASE WHEN user_like.like_id IS NOT NULL THEN 1 ELSE 0 END) as user_has_liked'),
                DB::raw(
                    '(SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
                    "media_id", m.media_id,
                    "url", m.url,
                    "type", m.type,
                    "size", m.size,
                    "mime_type", m.mime_type
                )),JSON_ARRAY())
                FROM media m
                WHERE m.post_id = posts.post_id
                ) as media'
                )
            )
            ->groupBy(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'posts.external_link',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at'
            )
            ->latest('posts.created_at')
            ->paginate(10);

        return response()->json($posts);
    }

    public function showPost(string $id)
    {
        $authId = Auth::id();

        $post = DB::table('posts')->where('post_id', $id)->first();
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $profile = DB::table('profiles')->where('user_id', $post->author_id)->first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        if ($profile->is_private && $authId != $post->author_id) {
            $isFollowing = DB::table('follows')
                ->where('follower_id', $authId)
                ->where('followed_id', $profile->user_id)
                ->exists();

            if (!$isFollowing) {
                return response()->json(['message' => 'The account of the owner of this post is private'], 403);
            }
        }

        $postWithDetails = DB::table('posts')
            ->join('profiles', 'posts.author_id', '=', 'profiles.user_id')
            ->leftJoin('likes', 'posts.post_id', '=', 'likes.post_id')
            ->leftJoin('likes as user_like', function ($join) use ($authId) {
                $join->on('posts.post_id', '=', 'user_like.post_id')
                    ->where('user_like.user_id', '=', $authId);
            })
            ->leftJoin('comments', 'posts.post_id', '=', 'comments.post_id')
            ->where('posts.post_id', $id)
            ->select(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'profiles.display_name',
                'posts.external_link',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at',
                DB::raw('COUNT(DISTINCT likes.like_id) as likes_count'),
                DB::raw('COUNT(DISTINCT comments.comment_id) as comments_count'),
                DB::raw('MAX(CASE WHEN user_like.like_id IS NOT NULL THEN 1 ELSE 0 END) as user_has_liked'),
                DB::raw(
                    '(SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
                    "media_id", m.media_id,
                    "url", m.url,
                    "type", m.type,
                    "size", m.size,
                    "mime_type", m.mime_type
                )),JSON_ARRAY())
                FROM media m
                WHERE m.post_id = posts.post_id
                ) as media'
                )
            )
            ->groupBy(
                'posts.post_id',
                'posts.content',
                'posts.author_id',
                'posts.external_link',
                'profiles.display_name',
                'profiles.avatar_url',
                'posts.created_at',
                'posts.updated_at'
            )
            ->first();

        return response()->json($postWithDetails);
    }



    public function createPost(createPostRequest $request)
    {

        DB::beginTransaction();

        try {

            $postId = Str::uuid();

            DB::table('posts')->insert([
                'post_id' => $postId,
                'content' => $request->content,
                'author_id' => Auth::id(),
                'external_link' => $request->external_link,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($request->hasFile('media')) {

                $manager = new ImageManager(new Driver());

                foreach ($request->file('media') as $file) {
                    $mediaId = Str::uuid();
                    $mime = $file->getMimeType();
                    $size = round($file->getSize() / 1024 / 1024, 2);

                    if (str_contains($mime, 'image')) {

                        // Resize & compress main image
                        $image = $manager->read($file)
                            ->scale(width: 1080)
                            ->toWebp(80);

                        $filename = 'posts/' . $mediaId . '.webp';
                        Storage::disk('public')->put($filename, $image);

                        // // Thumbnail
                        // $thumbnail = $manager->read($file)
                        //     ->scale(width: 400)
                        //     ->toWebp(70);

                        // Storage::disk('public')->put(
                        //     'posts/thumb_' . $mediaId . '.webp',
                        //     $thumbnail
                        // );

                        DB::table('media')->insert([
                            'media_id' => $mediaId,
                            'url' => $filename,
                            'type' => 'picture',
                            'size' => $size,
                            'mime_type' => 'image/webp',
                            'post_id' => $postId,
                            'message_id' => null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    } else {
                        // Video
                        $path = $file->store('posts', 'public');

                        DB::table('media')->insert([
                            'media_id' => $mediaId,
                            'url' => $path,
                            'type' => 'video',
                            'size' => $size,
                            'mime_type' => $mime,
                            'post_id' => $postId,
                            'message_id' => null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
            $this->handleHashtags($request->content, $postId);
            $this->handelNotification($postId);
            DB::commit();

            return response()->json([
                'message' => 'Post created successfully',
                'post_id' => $postId
            ], 201);
        } catch (\Exception $e) {

            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deletePost(string $id)
    {
        $post = DB::table('posts')->where('post_id', $id)->first();

        if (!$post) {
            return response()->json(['message' => 'post not found'], 404);
        }
        $user = Auth::user();
        if (!$user->is_admin && $post->author_id != $user->user_id) {
            return response()->json(['message' => 'forbidden'], 403);
        }
        DB::table('posts')->where('post_id', $id)->delete();
        return response()->json(['message' => 'the post deleted successfuly']);
    }

    private function handelNotification($postId)
    {
        $userId = Auth::id();
        $followers = Follow::where('followed_id', $userId)->get();
        foreach ($followers as $follower) {
            notification::create([
                'notification_id' => Str::uuid(),
                'user_id' => $follower->follower_id,
                'post_id' => $postId,
                'source_user_id' => $userId,
                'type' => 'post',
            ]);
        }
    }

    public function update(updatePostRequest $request, string $postId)
    {

        $post = Post::find($postId);


        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        $user = Auth::user();
        if (!$user->is_admin && $post->author != $user->id) {
            return response()->json(['message' => 'forbidden'], 403);
        }


        $post->update([
            'content' => $request->content ?? $post->content,
        ]);

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post
        ]);
    }

    private function handleHashtags($content, $postId)
    {
        if (!$content) return;

        preg_match_all('/#(\w+)/u', $content, $matches);

        $tags = array_unique($matches[1]);

        foreach ($tags as $tag) {

            $tag = strtolower($tag);

            $existing = DB::table('hashtags')
                ->where('tag', $tag)
                ->first();

            if (!$existing) {

                $hashtagId = Str::uuid();

                DB::table('hashtags')->insert([
                    'hashtag_id' => $hashtagId,
                    'tag' => $tag,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $hashtagId = $existing->hashtag_id;
            }

            DB::table('post_hashtags')->insert([
                'postHashtage_id' => Str::uuid(),
                'post_id' => $postId,
                'hashtag_id' => $hashtagId,
            ]);
        }
    }
}
