<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\changeEmailRequest;
use App\Http\Requests\changeForgotPasswordRequest;
use App\Mail\SendForgotPasswordEmail;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class PasswordController extends Controller
{ 
    public function forgotPassword(changeEmailRequest $request){
        $email = $request->email;
        $user = User::where('email',$email)->first();

        try{
            if(!$user){
                return response()->json(['message'=>'user not found'],404);
            }
            if(!$user->email_verified_at){
                return response()->json(['message'=>'the email is not confirmed']);
            }
            
            $secret=env('JWT_SECRET').$user->password;
            $token = Hash::make($secret);
            $link = 'http://localhost:3000/reset-password/'. $user->user_id . '/' . $token;
            Mail::to($email)->send(new SendForgotPasswordEmail($link));
            return response()->json(['message'=>'the email sent successfuly']);
        }catch(Exception $e){
            return response()->json(['message'=>'server error','error'=>$e],501);
        }
    }

    public function changePassword(changeForgotPasswordRequest $request ,string $token,string $userId){
        $user = User::find($userId);
        if(!$user){
            return response()->json(['message'=>'user not found']);
        }
        try{
            $secret=env('JWT_SECRET').$user->password;

            if(!Hash::check($secret,$token)){
                return response()->json(['message'=>'this link expired'],400);
            }

            $user->update([
                'password'=>Hash::make($request->password)
            ]);

            return response()->json(['message'=>'password updated successfuly']);

        }catch(Exception $e){
            return response()->json(['message'=>'server error','error'=>$e]);
        }

    }

}
