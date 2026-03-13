<?php

use App\Models\File;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

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
$allowedAudioMimes = ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a'];
$allowedExtensions = ['webm', 'ogg', 'mp3', 'oga', 'm4a'];

Route::post('/upload', function (Request $request) use ($allowedAudioMimes, $allowedExtensions) {
    $request->validate([
        'audio_data' => [
            'required_if:type,soundRecord',
            'file',
            'max:20480',                            // 20 MB
            'mimetypes:' . implode(',', $allowedAudioMimes),
        ],
        'qa'       => 'required_if:type,qa|json',
        'type'     => 'required|in:soundRecord,qa',
        'phoneNo'  => ['nullable', 'string', 'max:20', 'regex:/^\+?[\d\s\-\(\)]{7,20}$/'],
        'language' => 'nullable|in:en,ar',
    ]);

    $address = "AudioFiles/" . Carbon::now("Asia/Muscat")->format("Y-M-d");

    try {
        if ($request->type === "soundRecord") {
            $uploadedFile = $request->file('audio_data');

            $ext = strtolower($uploadedFile->getClientOriginalExtension());
            $extension = in_array($ext, $allowedExtensions) ? $ext : 'ogg';
            $fileName = (string) Str::uuid() . '.' . $extension;

            if ($uploadedFile->storeAs($address, $fileName)) {
                $file = File::create([
                    "phoneNo"     => $request->input("phoneNo") ?: "unknown",
                    "fileAddress" => $address . "/" . $fileName,
                    "type"        => $request->type,
                    "hash"        => (string) Str::uuid(),
                ]);
                return response()->json(["file" => $file]);
            }

            return response()->json(["message" => "Failed to store file."], 500);
        } else {
            $file = File::create([
                "phoneNo" => $request->input("phoneNo") ?: "unknown",
                "qa"      => json_decode($request->input("qa"), true),
                "type"    => $request->type,
                "hash"    => (string) Str::uuid(),
            ]);
            return response()->json(["file" => $file]);
        }
    } catch (\Exception $exception) {
        $message = config('app.debug') ? $exception->getMessage() : 'An error occurred. Please try again.';
        return response()->json(["message" => $message], 500);
    }
})->middleware('throttle:15,1')->name('file.upload');

Route::get("/questions", [\App\Http\Controllers\QuestionController::class, "index"])
    ->middleware('throttle:60,1');
