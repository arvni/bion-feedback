<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUploadRequest extends FormRequest
{
    public const ALLOWED_MIMES = [
        'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a',
    ];

    public const ALLOWED_EXTENSIONS = [
        'webm', 'ogg', 'mp3', 'oga', 'm4a',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'audio_data' => [
                'required_if:type,soundRecord',
                'file',
                'max:20480',
                'mimetypes:' . implode(',', self::ALLOWED_MIMES),
            ],
            'qa'       => 'required_if:type,qa|json',
            'type'     => 'required|in:soundRecord,qa',
            'phoneNo'  => ['nullable', 'string', 'max:20', 'regex:/^\+?[\d\s\-\(\)]{7,20}$/'],
            'language' => 'nullable|in:en,ar',
        ];
    }
}
