<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class RouteController extends Controller
{
    public function getRoutes(){
        $routes = Route::getRoutes();
        return view('welcome',['routes'=>$routes]);
    }
}
