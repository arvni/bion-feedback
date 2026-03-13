<?php

namespace App\Http\Controllers;

use App\Enums\FeedbackType;
use App\Http\Requests\StoreUploadRequest;
use App\Jobs\SendFeedbackEmail;
use App\Services\FeedbackStorageService;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    public function __construct(private FeedbackStorageService $storage) {}

    public function store(StoreUploadRequest $request): JsonResponse
    {
        $phone = $request->input('phoneNo') ?: 'unknown';
        $type  = FeedbackType::from($request->input('type'));

        try {
            $file = match ($type) {
                FeedbackType::SoundRecord => $this->storage->storeVoice(
                    $request->file('audio_data'),
                    $phone
                ),
                FeedbackType::QA => $this->storage->storeQA(
                    json_decode($request->input('qa'), true),
                    $phone
                ),
            };
        } catch (\RuntimeException $e) {
            $message = config('app.debug') ? $e->getMessage() : 'Failed to store submission.';
            return response()->json(['message' => $message], 500);
        }

        SendFeedbackEmail::dispatch($file);

        return response()->json(['file' => $file], 201);
    }
}
