<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    public function contactsFull()
    {

        $authId = Auth::id();

        $privateContacts = DB::table('messages as m')
            ->join('users as u', function ($join) use ($authId) {
                $join->on(DB::raw("CASE 
            WHEN m.sender_id = '$authId' 
            THEN m.recipient_id 
            ELSE m.sender_id 
        END"), '=', 'u.user_id');
            })
            ->join('profiles as p', 'u.user_id', '=', 'p.user_id')
            ->whereNull('m.group_id')
            ->where(function ($q) use ($authId) {
                $q->where('m.sender_id', $authId)
                    ->orWhere('m.recipient_id', $authId);
            })
            ->select(
                DB::raw("'private' as type"),
                'u.user_id',
                'p.display_name',
                'p.avatar_url',
                DB::raw('(SELECT content 
                 FROM messages 
                 WHERE 
                    (sender_id = u.user_id AND recipient_id = "' . $authId . '") 
                 OR 
                    (sender_id = "' . $authId . '" AND recipient_id = u.user_id)
                 ORDER BY created_at DESC 
                 LIMIT 1) as last_message'),
                DB::raw('NULL as group_id'),
                DB::raw('NULL as name'),
                DB::raw('NULL as photo_url')
            )
            ->groupBy('u.user_id', 'p.display_name', 'p.avatar_url')
            ->get();

        $groups = DB::table('groups as g')
            ->join('groupemembers as gm', 'g.group_id', '=', 'gm.group_id')
            ->join('messages as m', 'g.group_id', '=', 'm.group_id')
            ->where('gm.user_id', $authId)
            ->select(
                DB::raw("'group' as type"),
                DB::raw('NULL as user_id'),
                DB::raw('NULL as display_name'),
                DB::raw('NULL as avatar_url'),
                DB::raw('MAX(m.content) as last_message'),
                DB::raw('MAX(m.created_at) as last_message_time'),
                DB::raw('NULL as is_active'),
                'g.group_id',
                'g.name',
                'g.photo_url'
            )
            ->groupBy('g.group_id', 'g.name', 'g.photo_url')
            ->get();

        $contacts = $privateContacts
            ->merge($groups)
            ->sortByDesc('last_message_time')
            ->values();

        return response()->json($contacts);
    }

    public function unreadMessagesCount()
    {
        $authId = Auth::id();
        $unreadPrivate = DB::table('messages')
            ->where('recipient_id', $authId)
            ->whereNull('group_id')
            ->where('is_read', 0)
            ->count();

        $unreadGroups = DB::table('messages as m')
            ->join('groupemembers as gm', 'm.group_id', '=', 'gm.group_id')
            ->where('gm.user_id', $authId)
            ->where('m.sender_id', '!=', $authId)
            ->where('m.is_read', 0)
            ->count();

        $totalUnread = $unreadPrivate + $unreadGroups;

        return response()->json([
            'total_unread_messages' => $totalUnread
        ]);
    }

    public function conversation(string $userId)
    {
        $authId = Auth::id();

        DB::table('messages')
            ->where('sender_id', $userId)
            ->where('recipient_id', $authId)
            ->whereNull('group_id')
            ->where('is_read', 0)
            ->update([
                'is_read' => 1,
                'updated_at' => now()
            ]);

        $messages = DB::table('messages as m')
            ->leftJoin('media as md', 'm.message_id', '=', 'md.message_id')
            ->whereNull('m.group_id')
            ->where(function ($q) use ($authId, $userId) {
                $q->where(function ($query) use ($authId, $userId) {
                    $query->where('m.sender_id', $authId)
                        ->where('m.recipient_id', $userId);
                })
                    ->orWhere(function ($query) use ($authId, $userId) {
                        $query->where('m.sender_id', $userId)
                            ->where('m.recipient_id', $authId);
                    });
            })

            ->select(
                'm.message_id',
                'm.content',
                'm.created_at',
                'm.is_read',

                DB::raw("CASE 
            WHEN m.sender_id = '$authId' 
            THEN 1 ELSE 0 
        END as is_user"),

                DB::raw("
            IF(COUNT(md.media_id) > 0,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'media_id', md.media_id,
                        'url', md.url,
                        'type', md.type,
                        'size', md.size,
                        'mime_type', md.mime_type
                    )
                ),
                JSON_ARRAY()
            ) as media
        ")
            )

            ->groupBy(
                'm.message_id',
                'm.content',
                'm.created_at',
                'm.is_read',
                'm.sender_id'
            )

            ->orderBy('m.created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    // public function deleteMessage(string $messageId){
    //     $message=message::find($messageId);
    //     if(!$message){
    //         response()->json(['message'=>'message not found'],404);
    //     }
    //     isAdmineOrTheSameUser($message->sender_id);
    //     $message->delete();
    //     return response()->json(['message'=>'message deleted successfuly']);
    // }

    // public function sendPrivateMessage(string $userId, Request $request){
    //     $authId= Auth::id();
    //     $user = User::find($userId);
    //     if(!$user){
    //         return response()->json(['message'=>'user not found']);
    //     }

    //     message::create([
    //         'message_id'=>Str::uuid(),
    //         'content'=>$request->content,
    //         'sender_id'=>$authId,
    //         'recipient_id'=>$userId
    //     ]);
    // }
}
