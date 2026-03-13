<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('files', function (Blueprint $table) {
            // null = never queued, pending = queued, sent = delivered, failed = all retries exhausted
            $table->string('email_status', 20)->nullable()->after('hash');
            $table->timestamp('email_queued_at')->nullable()->after('email_status');
            $table->timestamp('email_sent_at')->nullable()->after('email_queued_at');
            $table->unsignedTinyInteger('email_attempts')->default(0)->after('email_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('files', function (Blueprint $table) {
            $table->dropColumn(['email_status', 'email_queued_at', 'email_sent_at', 'email_attempts']);
        });
    }
};
