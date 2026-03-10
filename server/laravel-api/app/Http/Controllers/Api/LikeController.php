<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\like;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
    public function likePost(string $postId){
        $userId =Auth::id();
        $post = DB::table('posts')->where('post_id',$postId)->first();
        if(!$post){
            return response()->json(['message'=>'post not found'],404);
        }
        $LikePost=DB::table('posts')
        ->join('likes','likes.post_id','=','posts.post_id')
        ->join('users','likes.user_id','=','users.user_id')
        ->where('likes.user_id',$userId)
        ->where('likes.post_id','=',$post->post_id)->first();

        if($LikePost){
            return response()->json(['message'=>'you already like this post'],401);
        }
        like::create([
            'like_id'=>Str::uuid(),
            'post_id'=>$postId,
            'user_id'=>$userId
        ]);
        return response()->json(['message'=>'the like create successfuly'],201);
    }

    public function deslikePost(string $postId){
        $userId =Auth::id();
        $post = DB::table('posts')->where('post_id',$postId)->first();
        if(!$post){
            return response()->json(['message'=>'post not found'],404);
        }
        $LikePost=DB::table('posts')
        ->join('likes','likes.post_id','=','posts.post_id')
        ->join('users','likes.user_id','=','users.user_id')
        ->where('likes.user_id',$userId)->first();

        if(!$LikePost){
            return response()->json(['message'=>'you dont not like this post']);
        }
        $like = like::find($LikePost->like_id);
        if(!$like){
            return response()->json(['message'=>'like not found'],404);
        }
        $like->delete();
        return response()->json(['message'=>'the message deleted successfuly']);
    }

    public function likeComment(string $commentId){
        $userId =Auth::id();
        $comment = DB::table('comments')->where('comment_id',$commentId)->first();
        if(!$comment){
            return response()->json(['message'=>'comment not found'],404);
        }
        $LikeComment=DB::table('comments')
        ->join('likes','likes.comment_id','=','comments.comment_id')
        ->join('users','likes.user_id','=','users.user_id')
        ->where('likes.user_id',$userId)
        ->where('likes.comment_id','=',$comment->comment_id)->first();

        if($LikeComment){
            return response()->json(['message'=>'you already like this comment'],401);
        }


        like::create([
            'like_id'=>Str::uuid(),
            'comment_id'=>$commentId,
            'user_id'=>$userId
        ]);
        return response()->json(['message'=>'the like create successfuly'],201);
    }

    public function deslikeComment(string $commentId){
        $userId =Auth::id();
        $comment = DB::table('comments')->where('comment_id',$commentId)->first();
        if(!$comment){
            return response()->json(['message'=>'comment not found'],404);
        }
        $LikeComment=DB::table('comments')
        ->join('likes','likes.comment_id','=','comments.comment_id')
        ->join('users','likes.user_id','=','users.user_id')
        ->where('likes.user_id',$userId)->first();

        if(!$LikeComment){
            return response()->json(['message'=>'you dont not like this comment']);
        }
        $like = like::find($LikeComment->like_id);
        if(!$like){
            return response()->json(['message'=>'like not found'],404);
        }
        $like->delete();
        return response()->json(['message'=>'the like deleted successfuly']);
    }
}
