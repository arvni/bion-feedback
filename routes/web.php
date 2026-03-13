<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/questions', [AdminController::class, 'questions'])->name('questions');
    Route::post('/questions', [AdminController::class, 'storeQuestion'])->name('questions.store');
    Route::put('/questions/{question}', [AdminController::class, 'updateQuestion'])->name('questions.update');
    Route::delete('/questions/{question}', [AdminController::class, 'destroyQuestion'])->name('questions.destroy');
    Route::get('/responses',    [AdminController::class, 'responses'])->name('responses');
    Route::get('/audio/{file}', [AdminController::class, 'streamAudio'])->name('audio');
});

require __DIR__ . '/auth.php';
