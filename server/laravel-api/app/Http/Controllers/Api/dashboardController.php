<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\handelReportRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;

class dashboardController extends Controller
{
    public function getAllReports(Request $request)
    {
        $user = Auth::user();
        if ($user->is_admin === 0) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        $search = $request->query('search');

        $reportQuery = DB::table('reports as r')
            ->leftJoin('profiles as reporter_profile', 'r.reporter_id', '=', 'reporter_profile.user_id')
            ->leftJoin('users as tu', 'r.target_id', '=', 'tu.user_id')
            ->leftJoin('profiles as target_profile', 'tu.user_id', '=', 'target_profile.user_id')
            ->leftJoin('posts as p', 'r.target_post_id', '=', 'p.post_id')
            ->leftJoin('profiles as post_profile', 'p.author_id', '=', 'post_profile.user_id')
            ->leftJoin('media as pm', 'p.post_id', '=', 'pm.post_id')
            ->leftJoin('comments as c', 'r.target_comment_id', '=', 'c.comment_id')
            ->leftJoin('profiles as comment_profile', 'c.author_id', '=', 'comment_profile.user_id')
            ->select(
                'r.report_id',
                'r.reason',
                'r.status',
                'r.handled_at',
                'r.created_at',
                DB::raw('reporter_profile.display_name as reporter_name'),
                DB::raw('reporter_profile.avatar_url as reporter_avatar'),
                'r.target_id',
                DB::raw('target_profile.display_name as target_user_name'),
                DB::raw('target_profile.avatar_url as target_user_avatar'),
                'r.target_post_id as post_id',
                DB::raw('p.content as post_content'),
                DB::raw("
            IF(COUNT(pm.media_id),
                JSON_ARRAYAGG(JSON_OBJECT(
                    'media_id', pm.media_id,
                    'url', pm.url,
                    'type', pm.type,
                    'size', pm.size,
                    'mime_type', pm.mime_type
                )),
                JSON_ARRAY()
            ) as post_media
        "),
                DB::raw('post_profile.display_name as post_owner_name'),
                DB::raw('post_profile.avatar_url as post_owner_avatar'),
                'r.target_comment_id as comment_id',
                DB::raw('c.content as comment_content'),
                DB::raw('comment_profile.display_name as comment_owner_name'),
                DB::raw('comment_profile.avatar_url as comment_owner_avatar'),
                DB::raw("
            CASE 
                WHEN r.target_comment_id IS NOT NULL THEN 'comment'
                WHEN r.target_post_id IS NOT NULL THEN 'post'
                WHEN r.target_id IS NOT NULL THEN 'user'
            END as report_type
        ")
            );

        if (!empty($search)) {
            $reportQuery->where(function($q) use ($search) {
                $q->where('r.report_id', 'like', "%{$search}%")
                  ->orWhere('target_profile.display_name', 'like', "%{$search}%")
                  ->orWhere('reporter_profile.display_name', 'like', "%{$search}%");
            });
        }

        $report = $reportQuery->groupBy(
                'r.report_id',
                'r.reason',
                'r.status',
                'r.handled_at',
                'r.created_at',
                'reporter_profile.display_name',
                'reporter_profile.avatar_url',
                'r.target_id',
                'target_profile.display_name',
                'target_profile.avatar_url',
                'r.target_post_id',
                'p.content',
                'post_profile.display_name',
                'post_profile.avatar_url',
                'r.target_comment_id',
                'c.content',
                'comment_profile.display_name',
                'comment_profile.avatar_url'
            )
            ->latest('r.created_at')
            ->paginate(10);
        return response()->json($report);
    }
    public function getReport(string $reportId)
    {
        $user = Auth::user();
        if ($user->is_admin === 0) {
            return response()->json(['message' => 'forbidden'], 403);
        }
        $report = DB::table('reports as r')

            // Reporter info
            ->leftJoin('profiles as reporter_profile', 'r.reporter_id', '=', 'reporter_profile.user_id')

            // Target User
            ->leftJoin('users as tu', 'r.target_id', '=', 'tu.user_id')
            ->leftJoin('profiles as target_profile', 'tu.user_id', '=', 'target_profile.user_id')

            // Target Post
            ->leftJoin('posts as p', 'r.target_post_id', '=', 'p.post_id')
            ->leftJoin('profiles as post_profile', 'p.author_id', '=', 'post_profile.user_id')
            ->leftJoin('media as pm', 'p.post_id', '=', 'pm.post_id')

            // Target Comment
            ->leftJoin('comments as c', 'r.target_comment_id', '=', 'c.comment_id')
            ->leftJoin('profiles as comment_profile', 'c.author_id', '=', 'comment_profile.user_id')
            ->where('r.report_id', $reportId)
            ->select(
                'r.report_id',
                'r.reason',
                'r.status',
                'r.handled_at',
                'r.created_at',

                // Reporter
                DB::raw('reporter_profile.display_name as reporter_name'),
                DB::raw('reporter_profile.avatar_url as reporter_avatar'),

                // Target User
                'r.target_id',
                DB::raw('target_profile.display_name as target_user_name'),
                DB::raw('target_profile.avatar_url as target_user_avatar'),

                // Target Post
                'r.target_post_id as post_id',
                DB::raw('p.content as post_content'),
                DB::raw("
            IF(COUNT(pm.media_id),
                JSON_ARRAYAGG(JSON_OBJECT(
                    'media_id', pm.media_id,
                    'url', pm.url,
                    'type', pm.type,
                    'size', pm.size,
                    'mime_type', pm.mime_type
                )),
                JSON_ARRAY()
            ) as post_media
        "),
                DB::raw('post_profile.display_name as post_owner_name'),
                DB::raw('post_profile.avatar_url as post_owner_avatar'),

                // Target Comment
                'r.target_comment_id as comment_id',
                DB::raw('c.content as comment_content'),
                DB::raw('comment_profile.display_name as comment_owner_name'),
                DB::raw('comment_profile.avatar_url as comment_owner_avatar'),

                // Report type
                DB::raw("
            CASE 
                WHEN r.target_comment_id IS NOT NULL THEN 'comment'
                WHEN r.target_post_id IS NOT NULL THEN 'post'
                WHEN r.target_id IS NOT NULL THEN 'user'
            END as report_type
        ")
            )
            ->groupBy(
                'r.report_id',
                'r.reason',
                'r.status',
                'r.handled_at',
                'r.created_at',
                'reporter_profile.display_name',
                'reporter_profile.avatar_url',
                'r.target_id',
                'target_profile.display_name',
                'target_profile.avatar_url',
                'r.target_post_id',
                'p.content',
                'post_profile.display_name',
                'post_profile.avatar_url',
                'r.target_comment_id',
                'c.content',
                'comment_profile.display_name',
                'comment_profile.avatar_url'
            )
            ->first();

        return response()->json($report);
    }

    public function count()
    {
        $user = Auth::user();
        if ($user->is_admin === 0) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        $now = Carbon::now();
        $startWeek = $now->copy()->startOfWeek();
        $endWeek = $now->copy()->endOfWeek();

        $stats = [
            'users' => [
                'total' => DB::table('users')->count(),
                'this_week' => DB::table('users')
                    ->whereBetween('created_at', [$startWeek, $endWeek])
                    ->count(),
                'this_month' => DB::table('users')
                    ->whereMonth('created_at', $now->month)
                    ->whereYear('created_at', $now->year)
                    ->count(),
                'this_year' => DB::table('users')
                    ->whereYear('created_at', $now->year)
                    ->count(),
            ],
            'posts' => [
                'total' => DB::table('posts')->count(),
                'this_week' => DB::table('posts')
                    ->whereBetween('created_at', [$startWeek, $endWeek])
                    ->count(),
                'this_month' => DB::table('posts')
                    ->whereMonth('created_at', $now->month)
                    ->whereYear('created_at', $now->year)
                    ->count(),
                'this_year' => DB::table('posts')
                    ->whereYear('created_at', $now->year)
                    ->count(),
            ],
            'reports' => [
                'total' => DB::table('reports')->count(),
                'this_week' => DB::table('reports')
                    ->whereBetween('created_at', [$startWeek, $endWeek])
                    ->count(),
                'this_month' => DB::table('reports')
                    ->whereMonth('created_at', $now->month)
                    ->whereYear('created_at', $now->year)
                    ->count(),
                'this_year' => DB::table('reports')
                    ->whereYear('created_at', $now->year)
                    ->count(),
            ],
        ];

        return response()->json($stats);
    }

    public function users(Request $request)
    {
        $user = Auth::user();
        if ($user->is_admin === 0) {
            return response()->json(['message' => 'forbidden'], 403);
        }
        $q = $request->query('q');
        if (empty($q)) {
            $users = DB::table('users')
                ->join('profiles', 'users.user_id', '=', 'profiles.user_id')
                ->paginate(10);
        } else {
            $users = DB::table('users')
                ->join('profiles', 'users.user_id', '=', 'profiles.user_id')
                ->where('profiles.display_name', 'like', "%{$q}%")
                ->orWhere('users.user_id', 'like', "%{$q}%")
                ->paginate(10);
        }

        return response()->json($users);
    }

    public function deleteUser(string $userId)
    {
        $user = Auth::user();
        if ($user->is_admin === 0) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'user not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'user deleted successfuly']);
    }


    public function handleReport(string $reportId, handelReportRequest $request)
    {

        $user = Auth::user();
        if ($user->is_admin === 0) {
            return response()->json(['message' => 'forbidden'], 403);
        }
        $action = $request->validated()['action'];
        $report = Report::where('report_id',$reportId)->first();

        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        $action = $request->input('action', 'ignore');

        DB::transaction(function () use ($report, $action) {
            if ($report->target_post_id && $action === 'delete') {
                DB::table('posts')->where('post_id', $report->target_post_id)->delete();
            }

            if ($report->target_comment_id && $action === 'delete') {
                Comment::where('comment_id', $report->target_comment_id)->delete();
            }

            if ($report->target_id) {
                $user = User::where('user_id',$report->target_id)->first();
                if ($user) {
                    if ($action === 'block') {
                        $user->delete();
                    }
                }
            }

            $report->status = $action === 'ignore' ? 'rejected' : 'completed';
            $report->handled_at = now();
            $report->save();
        });

        return response()->json([
            'message' => 'Report handled successfully',
            'status' => $report->status,
        ]);
    }
}
