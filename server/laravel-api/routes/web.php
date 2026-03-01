<?php

use App\Http\Controllers\RouteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [RouteController::class,'getRoutes']);
// Route::view('/confirm-email','email.confirmEmail');
Route::view('/forgotPassword','email.forgotPassword');
