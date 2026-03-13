<?php

use App\Services\EmailQueueService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(fn () => app(EmailQueueService::class)->queueMissedEmails())
    ->everyFiveMinutes()
    ->name('queue-missed-feedback-emails')
    ->withoutOverlapping();

Schedule::call(fn () => app(EmailQueueService::class)->retryFailedEmails())
    ->hourly()
    ->name('retry-failed-feedback-emails')
    ->withoutOverlapping();
