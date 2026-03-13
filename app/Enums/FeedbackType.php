<?php

namespace App\Enums;

enum FeedbackType: string
{
    case SoundRecord = 'soundRecord';
    case QA          = 'qa';

    public function label(): string
    {
        return match($this) {
            self::SoundRecord => 'Voice Recording',
            self::QA          => 'Q&A Survey',
        };
    }
}
