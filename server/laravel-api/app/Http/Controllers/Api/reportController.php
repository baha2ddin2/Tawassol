<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\reportRequest;
use App\Models\Post;
use App\Models\report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class reportController extends Controller
{
    public function reportPost(reportRequest $request, string $postId)
    {

        $post = Post::find($postId);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Prevent reporting your own post
        if ($post->author_id === Auth::id()) {
            return response()->json(['message' => 'You cannot report your own post'], 403);
        }

        // Create the report
        $report = Report::create([
            'report_id' => Str::uuid(),
            'reason' => $request->reason,
            'status' => 'in progress',
            'handled_at' => now(),
            'reporter_id' => Auth::id(),
            'target_post_id' => $post->post_id,
        ]);

        return response()->json([
            'message' => 'Report submitted successfully',
            'report' => $report,
        ], 201);
    }

    public function reportComment(reportRequest $request, string $commentId)
    {
        // Validate request
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $comment = Comment::find($commentId);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Prevent reporting your own comment
        if ($comment->author_id === Auth::id()) {
            return response()->json(['message' => 'You cannot report your own comment'], 403);
        }

        // Create the report
        $report = Report::create([
            'report_id' => Str::uuid(),
            'reason' => $request->reason,
            'status' => 'in progress',
            'handled_at' => now(),
            'reporter_id' => Auth::id(),
            'target_comment_id' => $comment->comment_id
        ]);

        return response()->json([
            'message' => 'Comment reported successfully',
            'report' => $report,
        ], 201);
    }

    public function reportUser(reportRequest $request, string $userId)
    {


        $targetUser = User::find($userId);
        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Prevent reporting yourself
        if ($targetUser->user_id === Auth::id()) {
            return response()->json(['message' => 'You cannot report yourself'], 403);
        }

        // Create the report
        $report = Report::create([
            'report_id' => Str::uuid(),
            'reason' => $request->reason,
            'status' => 'in progress',
            'handled_at' => now(),
            'reporter_id' => Auth::id(),
            'target_id' => $targetUser->user_id,
        ]);

        return response()->json([
            'message' => 'User reported successfully',
            'report' => $report,
        ], 201);
    }

    public function myReports()
    {
        $reports = DB::table('reports as r')
            ->leftJoin('profiles as target_profile', 'r.target_id', '=', 'target_profile.user_id')
            ->leftJoin('posts as p', 'r.target_post_id', '=', 'p.post_id')
            ->leftJoin('comments as c', 'r.target_comment_id', '=', 'c.comment_id')

            ->where('r.reporter_id', Auth::id())

            ->select(
                'r.report_id',
                'r.reason',
                'r.status',
                'r.created_at',

                'r.target_id',
                'r.target_post_id',
                'r.target_comment_id',

                DB::raw("
                CASE 
                    WHEN r.target_comment_id IS NOT NULL THEN 'comment'
                    WHEN r.target_post_id IS NOT NULL THEN 'post'
                    WHEN r.target_id IS NOT NULL THEN 'user'
                END as report_type
            ")
            )

            ->orderBy('r.created_at', 'desc')
            ->paginate(10);

        return response()->json($reports);
    }
}
