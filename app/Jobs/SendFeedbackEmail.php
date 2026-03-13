<?php

namespace App\Jobs;

use App\Mail\FeedbackReceived;
use App\Models\File;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendFeedbackEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** Retry up to 3 times before marking as failed. */
    public int $tries = 3;

    /** Back off: 1 min, 5 min, 15 min between retries. */
    public array $backoff = [60, 300, 900];

    public function __construct(public File $file) {}

    public function handle(): void
    {
        $to = config('mail.feedback_notify_email');

        if (!$to) {
            // No recipient configured — skip silently so the queue doesn't keep retrying.
            return;
        }

        Mail::to($to)->send(new FeedbackReceived($this->file));

        $this->file->update([
            'email_status'   => 'sent',
            'email_sent_at'  => now(),
            'email_attempts' => $this->file->email_attempts + 1,
        ]);
    }

    /** Called after all retries are exhausted. */
    public function failed(\Throwable $e): void
    {
        $this->file->update([
            'email_status'   => 'failed',
            'email_attempts' => $this->file->email_attempts + 1,
        ]);
    }
}
