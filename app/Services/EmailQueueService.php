<?php

namespace App\Services;

use App\Jobs\SendFeedbackEmail;
use App\Models\File;

class EmailQueueService
{
    private const MAX_ATTEMPTS = 3;

    /**
     * Queue any submissions that were never dispatched or are stuck in 'pending'
     * longer than 10 minutes (indicating the queue worker missed them).
     */
    public function queueMissedEmails(): void
    {
        File::whereNull('email_status')
            ->orWhere(function ($q) {
                $q->where('email_status', 'pending')
                  ->where('email_queued_at', '<', now()->subMinutes(10));
            })
            ->get()
            ->each(function (File $file) {
                $file->update(['email_status' => 'pending', 'email_queued_at' => now()]);
                SendFeedbackEmail::dispatch($file);
            });
    }

    /**
     * Re-queue failed emails that have not yet reached the max attempt limit.
     */
    public function retryFailedEmails(): void
    {
        File::where('email_status', 'failed')
            ->where('email_attempts', '<', self::MAX_ATTEMPTS)
            ->get()
            ->each(function (File $file) {
                $file->update(['email_status' => 'pending', 'email_queued_at' => now()]);
                SendFeedbackEmail::dispatch($file);
            });
    }
}
