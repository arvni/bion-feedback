<?php

namespace App\Http\Controllers;

use App\Jobs\SendFeedbackEmail;
use App\Models\File;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResponseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = File::latest();

        if ($request->filled('email_status')) {
            $query->where('email_status', $request->input('email_status'));
        }

        return Inertia::render('Admin/Responses', [
            'files' => $query->paginate(20)->withQueryString(),
        ]);
    }

    public function resendEmail(File $file): RedirectResponse
    {
        $file->update([
            'email_status'    => 'pending',
            'email_queued_at' => now(),
        ]);

        SendFeedbackEmail::dispatch($file);

        return back();
    }

    public function streamAudio(File $file): StreamedResponse
    {
        if ($file->type !== 'soundRecord' || ! $file->fileAddress) {
            abort(404);
        }

        $path = ltrim($file->fileAddress, '/');
        $ext  = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        if (! in_array($ext, config('media.allowed_audio_extensions'), true)) {
            abort(403);
        }

        if (! Storage::exists($path)) {
            abort(404, 'Audio file not found on disk.');
        }

        $mime         = Storage::mimeType($path) ?: 'audio/ogg';
        $safeFilename = 'audio-' . $file->id . '.' . $ext;

        return Storage::response($path, $safeFilename, [
            'Content-Type'        => $mime,
            'Content-Disposition' => 'inline; filename="' . $safeFilename . '"',
            'Accept-Ranges'       => 'bytes',
        ]);
    }
}
