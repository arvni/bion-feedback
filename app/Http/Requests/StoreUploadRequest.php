<?php

namespace App\Http\Requests;

use App\Enums\FeedbackType;
use Illuminate\Validation\Rules\Enum;

class StoreUploadRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'audio_data' => [
                'required_if:type,' . FeedbackType::SoundRecord->value,
                'file',
                'max:20480',
                'mimetypes:' . implode(',', config('media.allowed_audio_mimes')),
            ],
            'qa'       => 'required_if:type,' . FeedbackType::QA->value . '|json',
            'type'     => ['required', new Enum(FeedbackType::class)],
            'phoneNo'  => ['nullable', 'string', 'max:20', 'regex:/^\+?[\d\s\-\(\)]{7,20}$/'],
            'language' => 'nullable|in:en,ar',
        ];
    }
}
