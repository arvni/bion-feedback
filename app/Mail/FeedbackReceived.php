<?php

namespace App\Mail;

use App\Enums\FeedbackType;
use App\Models\File;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FeedbackReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public File $file) {}

    public function envelope(): Envelope
    {
        $type  = FeedbackType::tryFrom($this->file->type)?->label() ?? 'Feedback';
        $phone = $this->file->phoneNo ?? 'Unknown';

        return new Envelope(
            subject: "[Feedback] {$type} from {$phone}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.feedback-received',
        );
    }
}
