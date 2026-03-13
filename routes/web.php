<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QuestionAdminController;
use App\Http\Controllers\ResponseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Welcome'));

Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    Route::get('/',                          [DashboardController::class,      'index'])->name('dashboard');
    Route::get('/questions',                 [QuestionAdminController::class,  'index'])->name('questions');
    Route::post('/questions',                [QuestionAdminController::class,  'store'])->name('questions.store');
    Route::put('/questions/{question}',      [QuestionAdminController::class,  'update'])->name('questions.update');
    Route::delete('/questions/{question}',   [QuestionAdminController::class,  'destroy'])->name('questions.destroy');
    Route::get('/responses',                 [ResponseController::class,       'index'])->name('responses');
    Route::post('/responses/{file}/resend',  [ResponseController::class,       'resendEmail'])->name('responses.resend');
    Route::get('/audio/{file}',              [ResponseController::class,       'streamAudio'])->name('audio');
});

require __DIR__ . '/auth.php';
