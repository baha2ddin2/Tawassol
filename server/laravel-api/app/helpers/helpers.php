<?php 
use Illuminate\Support\Facades\Auth;


function isAdmin(){
    $user = Auth::user();
    if($user->is_admin===0){
        return response()->json(['message'=>'forbidden'],403);
    }
}

//if the user how delete this user not the same this function will return response with status 403 (forbiden)
function isAdmineOrTheSameUser(string $id){
    $user = Auth::user();
    if(!$user->is_admin && $id!=$user->id){
        return response()->json(['message'=>'forbidden'],403);
    }
}
