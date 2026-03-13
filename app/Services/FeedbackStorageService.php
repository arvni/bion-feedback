<?php

namespace App\Services;

use App\Enums\FeedbackType;
use App\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

class FeedbackStorageService
{
    public function storeVoice(UploadedFile $audio, string $phone): File
    {
        $folder    = $this->dailyFolder();
        $ext       = $this->safeExtension($audio);
        $fileName  = Str::uuid() . '.' . $ext;

        if (! $audio->storeAs($folder, $fileName)) {
            throw new RuntimeException('Failed to store audio file.');
        }

        return File::create([
            'phoneNo'         => $phone,
            'fileAddress'     => $folder . '/' . $fileName,
            'type'            => FeedbackType::SoundRecord->value,
            'hash'            => (string) Str::uuid(),
            'email_status'    => 'pending',
            'email_queued_at' => now(),
        ]);
    }

    public function storeQA(array $qa, string $phone): File
    {
        return File::create([
            'phoneNo'         => $phone,
            'qa'              => $qa,
            'type'            => FeedbackType::QA->value,
            'hash'            => (string) Str::uuid(),
            'email_status'    => 'pending',
            'email_queued_at' => now(),
        ]);
    }

    private function dailyFolder(): string
    {
        return 'AudioFiles/' . now('Asia/Muscat')->format('Y-M-d');
    }

    private function safeExtension(UploadedFile $file): string
    {
        $ext = strtolower($file->getClientOriginalExtension());
        return in_array($ext, config('media.allowed_audio_extensions'), true) ? $ext : 'ogg';
    }
}
