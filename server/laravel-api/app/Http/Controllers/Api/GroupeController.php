<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\addMembersRequest;
use App\Http\Requests\creatGroupRequest;
use App\Http\Requests\updateGroupRequest;
use App\Models\message;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class GroupeController extends Controller
{
    public function conversation(string $groupId)
    {
        $authId = Auth::id();

        $messages = DB::table('messages as m')

            ->join('profiles as p', 'm.sender_id', '=', 'p.user_id')
            ->leftJoin('media as md', 'm.message_id', '=', 'md.message_id')

            ->where('m.group_id', $groupId)

            ->select(
                'm.message_id',
                'm.sender_id',
                'm.content',
                'm.created_at',
                'p.display_name',
                'p.avatar_url',

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
                'm.sender_id',
                'm.content',
                'm.created_at',
                'p.display_name',
                'p.avatar_url'
            )

            ->orderBy('m.created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function createGroup(creatGroupRequest $request)
    {

        $authId = Auth::id();
        $groupId = Str::uuid();
        $filename = null;

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $mediaId = Str::uuid();
            $manager = new ImageManager(new Driver());
            $filename = 'group/' . $mediaId . '.webp';
            $image = $manager->read($file)
                ->scale(width: 1080)
                ->toWebp(80);
            Storage::disk('public')->put($filename, $image);
        }

        DB::table('groups')->insert([
            'group_id' => $groupId,
            'name' => $request->name,
            'description' => $request->description,
            'photo_url' => $filename,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('groupemembers')->insert([
            'groupemember' => Str::uuid(),
            'group_id' => $groupId,
            'user_id' => $authId,
            'role' => 'admin',
            'joined_at' => Carbon::now(),
        ]);

        $members = $request->members ?? [];

        foreach ($members as $memberId) {
            if ($memberId === $authId) continue;

            $authFollowsMember = DB::table('follows')
                ->where('follower_id', $authId)
                ->where('followed_id', $memberId)
                ->exists();

            $memberFollowsAuth = DB::table('follows')
                ->where('follower_id', $memberId)
                ->where('followed_id', $authId)
                ->exists();

            $canAdd = $authFollowsMember && $memberFollowsAuth;
            if ($canAdd) {
                DB::table('groupemembers')->insert([
                    'groupemember' => Str::uuid(),
                    'group_id' => $groupId,
                    'user_id' => $memberId,
                    'role' => 'member',
                    'joined_at' => Carbon::now(),
                ]);
            }
        }

        message::create([
            'message_id' => Str::uuid(),
            'content' => 'welcome to this group',
            'group_id' => $groupId,
            'sender_id' => Auth::id()
        ]);

        return response()->json([
            'message' => 'Group created successfully',
            'group_id' => $groupId
        ], 201);
    }

    public function addGroupMembers(addMembersRequest $request, string $groupId)
    {
        $authId = Auth::id();

        $group = DB::table('groups')->where('group_id', $groupId)->first();
        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        $members = $request->members;

        $addedMembers = [];

        foreach ($members as $memberId) {
            if ($memberId === $authId) continue;

            $canAdd = DB::table('follows')
                ->where(function ($q) use ($authId, $memberId) {
                    $q->where('follower_id', $authId)->where('followed_id', $memberId);
                })
                ->orWhere(function ($q) use ($authId, $memberId) {
                    $q->where('follower_id', $memberId)->where('followed_id', $authId);
                })
                ->exists();

            if (!$canAdd) continue;

            $alreadyMember = DB::table('groupemembers')
                ->where('group_id', $groupId)
                ->where('user_id', $memberId)
                ->exists();

            if ($alreadyMember) continue;

            DB::table('groupemembers')->insert([
                'groupemember' => Str::uuid(),
                'group_id' => $groupId,
                'user_id' => $memberId,
                'role' => 'member',
                'joined_at' => Carbon::now(),
            ]);

            $addedMembers[] = $memberId;
        }

        return response()->json([
            'message' => 'Members added successfully',
            'added_members' => $addedMembers
        ], 201);
    }

    public function updateGroup(updateGroupRequest $request, string $groupId)
    {
        $authId = Auth::id();
        $group = DB::table('groups')->where('group_id', $groupId)->first();
        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }



        $isAdmin = DB::table('groupemembers')
            ->where('group_id', $groupId)
            ->where('user_id', $authId)
            ->where('role', 'admin')
            ->exists();

        if (!$isAdmin) {
            return response()->json(['message' => 'Only group admin can update group'], 403);
        }
        $filename = null;
        $data = [];

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $mediaId = Str::uuid();
            $manager = new ImageManager(new Driver());
            $filename = 'posts/' . $mediaId . '.webp';
            $image = $manager->read($file)
                ->scale(width: 1080)
                ->toWebp(80);
            Storage::disk('public')->put($filename, $image);

            $data = array_filter([
                'name' => $request->name,
                'description' => $request->description,
                'photo_url' => $filename,
                'updated_at' => now(),
            ]);
        }

        if (!$request->hasFile('photo')) {
            $data = array_filter([
                'name' => $request->name,
                'description' => $request->description,
                'updated_at' => now(),
            ]);
        }

        if (empty($data)) {
            return response()->json(['message' => 'No data provided to update'], 400);
        }


        DB::table('groups')->where('group_id', $groupId)->update($data);

        return response()->json(['message' => 'Group updated successfully', 'data' => $data]);
    }

    public function deleteGroup(string $groupId)
    {
        $authId = Auth::id();

        $group = DB::table('groups')
            ->where('group_id', $groupId)
            ->first();

        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        $oldestAdmin = DB::table('groupemembers')
            ->where('group_id', $groupId)
            ->where('role', 'admin')
            ->orderBy('joined_at', 'asc')
            ->first();

        if (!$oldestAdmin || $oldestAdmin->user_id !== $authId) {
            return response()->json([
                'message' => 'Only the oldest admin can delete the group'
            ], 403);
        }

        DB::transaction(function () use ($groupId) {
            DB::table('groupemembers')->where('group_id', $groupId)->delete();
            DB::table('groups')->where('group_id', $groupId)->delete();
        });

        return response()->json([
            'message' => 'Group deleted successfully'
        ]);
    }

    public function removeMember(string $groupId, string $userId)
    {
        $authId = Auth::id();
        
        $groupAdmin = DB::table('groupemembers')
            ->where('group_id', $groupId)
            ->where('user_id', $authId)
            ->where('role', 'admin')
            ->exists();
            
        if (!$groupAdmin && $authId !== $userId) {
            return response()->json(['message' => 'Unauthorized to remove member'], 403);
        }
        
        DB::table('groupemembers')
            ->where('group_id', $groupId)
            ->where('user_id', $userId)
            ->delete();
            
        return response()->json(['message' => 'Member removed successfully']);
    }

    public function makeAdmin(string $groupId, string $userId)
    {
        $authId = Auth::id();
        
        $groupAdmin = DB::table('groupemembers')
            ->where('group_id', $groupId)
            ->where('user_id', $authId)
            ->where('role', 'admin')
            ->exists();
            
        if (!$groupAdmin) {
            return response()->json(['message' => 'Only admins can promote members'], 403);
        }
        
        DB::table('groupemembers')
            ->where('group_id', $groupId)
            ->where('user_id', $userId)
            ->update(['role' => 'admin']);
            
        return response()->json(['message' => 'Member promoted to admin']);
    }

    public function getGroupDetails(string $groupId)
    {

        $group = DB::table('groups')
            ->where('group_id', $groupId)
            ->first();

        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        $members = DB::table('groupemembers as gm')
            ->join('profiles as p', 'gm.user_id', '=', 'p.user_id')
            ->where('gm.group_id', $groupId)
            ->select(
                'gm.user_id',
                'gm.role',
                'p.display_name',
                'p.avatar_url',
                'gm.joined_at'
            )
            ->get();

        return response()->json([
            'group_id'   => $group->group_id,
            'name'       => $group->name,
            'description' => $group->description,
            'photo_url'  => $group->photo_url,
            'created_at' => $group->created_at,
            'members'    => $members
        ]);
    }

    public function getAvailableMembers()
    {

        $authId = Auth::id();

        $users = DB::table('users as u')
            ->join('profiles as p', 'u.user_id', '=', 'p.user_id')
            ->join('follows as f1', function ($join) use ($authId) {
                $join->on('f1.followed_id', '=', 'u.user_id')
                    ->where('f1.follower_id', '=', $authId);
            })
            ->join('follows as f2', function ($join) use ($authId) {
                $join->on('f2.follower_id', '=', 'u.user_id')
                    ->where('f2.followed_id', '=', $authId);
            })
            ->where('u.user_id', '!=', $authId)

            ->select(
                'u.user_id',
                'p.display_name',
                'p.avatar_url'
            )
            ->get();

        return response()->json($users);
    }
}
