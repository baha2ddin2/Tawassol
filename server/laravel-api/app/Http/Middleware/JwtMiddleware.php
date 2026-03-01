<?php
namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token =$request->cookie('access_token');
        if(!$token){
            return response()->json(['message'=>'unauthenticated (no token)','token'=>$token],401);
        }
        try {
            JWTAuth::setToken($token);
            $user =JWTAuth::authenticate();
            if(!$user){
                return response()->json(['message' => 'user not found'],401);
            }
            Auth::setUser($user);
        } catch (Exception $e) {
            return response()->json(['message' => 'invalid or expired token' ,'error'=>$e], 401);
        }

        return $next($request);
    }
}