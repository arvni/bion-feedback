<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUploadRequest;
use App\Jobs\SendFeedbackEmail;
use App\Models\File;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(StoreUploadRequest $request): JsonResponse
    {
        $phone   = $request->input('phoneNo') ?: 'unknown';
        $folder  = 'AudioFiles/' . Carbon::now('Asia/Muscat')->format('Y-M-d');

        $file = $request->type === 'soundRecord'
            ? $this->storeVoice($request, $phone, $folder)
            : $this->storeQA($request, $phone);

        if (! $file) {
            return response()->json(['message' => 'Failed to store file.'], 500);
        }

        SendFeedbackEmail::dispatch($file);

        return response()->json(['file' => $file], 201);
    }

    private function storeVoice(StoreUploadRequest $request, string $phone, string $folder): ?File
    {
        $uploaded  = $request->file('audio_data');
        $ext       = strtolower($uploaded->getClientOriginalExtension());
        $extension = in_array($ext, StoreUploadRequest::ALLOWED_EXTENSIONS, true) ? $ext : 'ogg';
        $fileName  = Str::uuid() . '.' . $extension;

        if (! $uploaded->storeAs($folder, $fileName)) {
            return null;
        }

        return File::create([
            'phoneNo'         => $phone,
            'fileAddress'     => $folder . '/' . $fileName,
            'type'            => 'soundRecord',
            'hash'            => (string) Str::uuid(),
            'email_status'    => 'pending',
            'email_queued_at' => now(),
        ]);
    }

    private function storeQA(StoreUploadRequest $request, string $phone): File
    {
        return File::create([
            'phoneNo'         => $phone,
            'qa'              => json_decode($request->input('qa'), true),
            'type'            => 'qa',
            'hash'            => (string) Str::uuid(),
            'email_status'    => 'pending',
            'email_queued_at' => now(),
        ]);
    }
}
