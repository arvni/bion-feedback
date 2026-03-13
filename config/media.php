<?php

return [
    'allowed_audio_mimes' => [
        'audio/webm', 'audio/webm;codecs=opus',
        'video/webm',                             // finfo reports WebM audio as video/webm
        'audio/ogg', 'audio/ogg;codecs=opus',
        'audio/mpeg', 'audio/mp4', 'audio/x-m4a',
    ],
    'allowed_audio_extensions' => [
        'webm', 'ogg', 'mp3', 'oga', 'm4a', 'mp4',
    ],
];
