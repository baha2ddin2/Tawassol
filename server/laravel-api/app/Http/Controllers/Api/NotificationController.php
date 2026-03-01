<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function getNotifications(){
        $authId = Auth::id();
        $notifications = DB::table('notifications')
            ->join('profiles as source_profile', 'notifications.source_user_id', '=', 'source_profile.user_id')
            ->leftJoin('posts', 'notifications.post_id', '=', 'posts.post_id')
            ->leftJoin('comments', 'notifications.comment_id', '=', 'comments.comment_id')
            ->where('notifications.user_id', $authId)
            ->select(
                'notifications.notification_id',
                'notifications.type',
                'notifications.is_read',
                'notifications.created_at',

                'source_profile.user_id as source_user_id',
                'source_profile.display_name',
                'source_profile.avatar_url',

                'posts.post_id',
                'posts.content',

                'comments.comment_id',
                'comments.content as comment_content'
            )
            ->orderByDesc('notifications.created_at')
            ->paginate(15);

        return response()->json($notifications);
    } 

    public function unreadCount()
    {
        $authId = Auth::id();
        $count = DB::table('notifications')
            ->where('user_id', $authId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'unread_count' => $count
        ]);
    }

    public function markAsRead($notificationId)
    {
        $notification =  notification::find($notificationId);
        if(!$notification){
            return response()->json(['message'=>'notification not found']);
        }

        isAdmineOrTheSameUser($notification->user_id);

        DB::table('notifications')
            ->where('notification_id', $notificationId)
            ->update([
                'is_read' => true,
                'updated_at' => now()
            ]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead()
    {
        $authId = Auth::id();
        DB::table('notifications')
            ->where('user_id', $authId)
            ->update([
                'is_read' => true,
                'updated_at' => now()
            ]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
