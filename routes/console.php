<?php

use App\Jobs\SendFeedbackEmail;
use App\Models\File;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Tasks
|--------------------------------------------------------------------------
*/

// Every 5 minutes: catch any submissions that were never queued
// (e.g. if the queue driver was unavailable at submission time).
Schedule::call(function () {
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
})->everyFiveMinutes()
  ->name('queue-missed-feedback-emails')
  ->withoutOverlapping();

// Every hour: re-queue failed emails that haven't exceeded max attempts.
Schedule::call(function () {
    File::where('email_status', 'failed')
        ->where('email_attempts', '<', 3)
        ->get()
        ->each(function (File $file) {
            $file->update(['email_status' => 'pending', 'email_queued_at' => now()]);
            SendFeedbackEmail::dispatch($file);
        });
})->hourly()
  ->name('retry-failed-feedback-emails')
  ->withoutOverlapping();
