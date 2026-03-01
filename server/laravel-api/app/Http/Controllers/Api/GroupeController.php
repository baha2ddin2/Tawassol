<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\addMembersRequest;
use App\Http\Requests\creatGroupRequest;
use App\Http\Requests\updateGroupRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class GroupeController extends Controller
{
    public function conversation(string $groupId)
    {
        $authId = Auth::id();

        $messages = DB::table('messages')
            ->join('profiles', 'messages.sender_id', '=', 'profiles.user_id')
            ->where('group_id', $groupId)
            ->select(
                'messages.message_id',
                'messages.sender_id',
                'messages.content',
                'messages.created_at',
                'profiles.display_name',
                'profiles.avatar_url',
                DB::raw("CASE WHEN messages.sender_id = '$authId' THEN 1 ELSE 0 END as is_user")
            )
            ->orderBy('messages.created_at', 'asc')
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
            $filename = 'posts/' . $mediaId . '.webp';
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

            $canAdd = DB::table('follows')
                ->where(function ($q) use ($authId, $memberId) {
                    $q->where('follower_id', $authId)->where('followed_id', $memberId);
                })
                ->Where(function ($q) use ($authId, $memberId) {
                    $q->where('follower_id', $memberId)->where('followed_id', $authId);
                })
                ->exists();

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

    public function getGroupDetails(string $groupId)
    {
        // Get group info
        $group = DB::table('groups')
            ->where('group_id', $groupId)
            ->first();

        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        // Get members
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

    public function getAvailableMembers(string $groupId){
        
        $authId = Auth::id();

        $users = DB::table('users as u')
            ->join('profiles as p', 'u.user_id', '=', 'p.user_id')

            // Mutual Follow
            ->join('follows as f1', function ($join) use ($authId) {
                $join->on('f1.followed_id', '=', 'u.user_id')
                    ->where('f1.follower_id', '=', $authId);
            })
            ->join('follows as f2', function ($join) use ($authId) {
                $join->on('f2.follower_id', '=', 'u.user_id')
                    ->where('f2.followed_id', '=', $authId);
            })

            // Exclude users already in group
            ->whereNotExists(function ($query) use ($groupId) {
                $query->select(DB::raw(1))
                    ->from('groupemembers as gm')
                    ->whereColumn('gm.user_id', 'u.user_id')
                    ->where('gm.group_id', $groupId);
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
