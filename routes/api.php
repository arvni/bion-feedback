<?php

use App\Models\File;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/upload', function (Request $request) {
    $request->validate([
        'audio_data' => 'required'
    ]);
    $uploadedFile = $request->file('audio_data');
    $fileName = Carbon::now()->timestamp . "." . "wav";
    $address = "/AudioFiles/" . Carbon::now("Asia/Muscat")->format("Y-M-d");
    try {
        if ($uploadedFile->storeAs($address, $fileName)) {
            $file = File::create([
                "name" => $request["name"] ?? "no name",
                "phoneNo" => $request["number"] ?? "no phone Number",
                "fileAddress" => $address . "/" . $fileName
            ]);
            return response()->json(["file" => $file]);
        }
    } catch (Exception $exception) {
        return response()->json(["message" => $exception->getMessage()], 500);
    }
})->name('file.upload');

Route::get('/download/{id}', function ($id) {
    $file = File::find($id);
    //return $file;
    return Response::download(storage_path("app".$file->fileAddress), null, [
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
        'Pragma' => 'no-cache',
        'Expires' => '0',
    ], null);
});
