<?php

use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

Route::post('/upload',    [UploadController::class,  'store'])->middleware('throttle:15,1')->name('file.upload');
Route::get('/questions',  [QuestionController::class, 'index'])->middleware('throttle:60,1');
