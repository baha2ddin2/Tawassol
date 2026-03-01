<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\createCommentRequest;
use App\Models\Comment;
use App\Models\notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CommentController extends Controller
{
    public function createComment(createCommentRequest $request, string $postId)
    {

        $userId = Auth::id();

        $post = DB::table('posts')
            ->where('post_id', $postId)
            ->first();

        if (!$post) {
            return response()->json(['message' => 'post not found'], 404);
        }

        $comment = Comment::create([
            'comment_id' => Str::uuid(),
            'author_id' => $userId,
            'content' => $request->content,
            'post_id' => $postId
        ]);

        notification::create([
            'notification_id'=>Str::uuid(),
            'user_id'=>$post->author_id,
            'comment_id'=>$comment->comment_id,
            'source_user_id'=>$userId,
            'type'=>'comment',
        ]);

        return response()->json([
            'message' => 'the comment created successfuly',
            'data' => $comment
        ]);
    }

    public function showComments(string $postId)
    {
        $authId = Auth::id();
        $comments = DB::table('comments')
            ->join('users', 'users.user_id', 'comments.author_id')
            ->join('profiles', 'profiles.user_id', 'users.user_id')
            ->join('posts','posts.post_id','comments.comment_id')
            ->leftJoin('likes', 'comments.comment_id', '=', 'likes.comment_id')
            ->leftJoin('likes as user_like', function ($join) use ($authId) {
                $join->on('comments.comment_id', '=', 'user_like.comment_id')
                    ->where('user_like.user_id', '=', $authId);
            })
            ->where('posts.post_id',$postId)
            ->select(
                'comments.comment_id',
                'comments.content',
                'users.user_id',
                'profiles.avatar_url',
                'profiles.display_name',
                'comments.created_at',
                'comments.updated_at',
                DB::raw('MAX(CASE WHEN user_like.like_id IS NOT NULL THEN 1 ELSE 0 END) as user_has_liked'),
            )->groupBy(
                'comments.comment_id',
                'comments.content',
                'comments.author_id',
                'profiles.display_name',
                'profiles.avatar_url',
                'comments.created_at',
                'comments.updated_at'
            )
            ->latest('comments.created_at')
            ->paginate(10);


        return response()->json($comments);
    }

    public function deleteComment($commentId){
        $comment = Comment::find($commentId);
        if(!$comment){
            return response()->json(['message'=>'comment not found'],404);
        }
        isAdmineOrTheSameUser($comment->author_id);

        $comment->delete();
        return response()->json(['message'=>'the comment deleted successfuly']) ;
    }
}
