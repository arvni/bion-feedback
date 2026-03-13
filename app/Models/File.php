<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        "phoneNo",
        "hash",
        "fileAddress",
        "qa",
        "type",
        "description",
        "email_status",
        "email_queued_at",
        "email_sent_at",
        "email_attempts",
    ];
    protected $casts = [
        "qa"               => "json",
        "email_queued_at"  => "datetime",
        "email_sent_at"    => "datetime",
        "email_attempts"   => "integer",
    ];
}
