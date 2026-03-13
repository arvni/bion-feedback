<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalResponses = File::count();
        $qaCount        = File::where('type', 'qa')->count();
        $soundCount     = File::where('type', 'soundRecord')->count();

        $questions = Question::orderBy('order')->get();
        $qaFiles   = File::where('type', 'qa')->whereNotNull('qa')->get();

        $questionStats = $questions->map(function ($question) use ($qaFiles) {
            $ratings = [];
            foreach ($qaFiles as $file) {
                $qa = $file->qa;
                if (!is_array($qa)) continue;
                foreach ($qa as $answer) {
                    $qId = $answer['question']['id'] ?? null;
                    if ($qId == $question->id && isset($answer['value'])) {
                        $ratings[] = (int) $answer['value'];
                    }
                }
            }
            $dist = [0 => 0, 1 => 0, 2 => 0, 3 => 0, 4 => 0];
            foreach ($ratings as $r) {
                if (array_key_exists($r, $dist)) $dist[$r]++;
            }
            return [
                'id'           => $question->id,
                'text'         => $question->text,
                'text_ar'      => $question->text_ar,
                'count'        => count($ratings),
                'average'      => count($ratings) > 0 ? round(array_sum($ratings) / count($ratings), 2) : null,
                'distribution' => $dist,
            ];
        });

        return Inertia::render('Admin/Dashboard', compact('totalResponses', 'qaCount', 'soundCount', 'questionStats'));
    }

    public function questions()
    {
        $questions = Question::orderBy('order')->get();
        return Inertia::render('Admin/Questions', compact('questions'));
    }

    public function storeQuestion(Request $request)
    {
        $request->validate([
            'text'    => 'required|string|max:500',
            'text_ar' => 'nullable|string|max:500',
            'order'   => 'required|integer|min:1|max:999|unique:questions,order',
        ]);

        Question::create($request->only('text', 'text_ar', 'order'));

        return back();
    }

    public function updateQuestion(Request $request, Question $question)
    {
        $request->validate([
            'text'    => 'sometimes|required|string|max:500',
            'text_ar' => 'nullable|string|max:500',
            'order'   => 'sometimes|required|integer|min:1|max:999|unique:questions,order,' . $question->id,
            'status'  => 'sometimes|boolean',
        ]);

        $question->update($request->only('text', 'text_ar', 'order', 'status'));

        return back();
    }

    public function destroyQuestion(Question $question)
    {
        $question->delete();
        return back();
    }

    public function responses()
    {
        $files = File::latest()->paginate(20);
        return Inertia::render('Admin/Responses', compact('files'));
    }

    public function streamAudio(File $file)
    {
        if ($file->type !== 'soundRecord' || !$file->fileAddress) {
            abort(404);
        }

        $path = ltrim($file->fileAddress, '/');

        // Whitelist allowed audio extensions — prevents serving arbitrary files
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($ext, ['ogg', 'webm', 'mp3', 'oga', 'm4a'], true)) {
            abort(403);
        }

        if (!Storage::exists($path)) {
            abort(404, 'Audio file not found on disk.');
        }

        $mime = Storage::mimeType($path) ?: 'audio/ogg';

        // Use opaque filename — don't expose internal path or timestamp
        $safeFilename = 'audio-' . $file->id . '.' . $ext;

        return Storage::response($path, $safeFilename, [
            'Content-Type'        => $mime,
            'Content-Disposition' => 'inline; filename="' . $safeFilename . '"',
            'Accept-Ranges'       => 'bytes',
        ]);
    }
}
