<?php

namespace App\Services;

use App\Models\File;
use App\Models\Question;
use Illuminate\Support\Collection;

class DashboardService
{
    public function getStats(): array
    {
        $questions = Question::orderBy('order')->get();
        $qaFiles   = File::where('type', 'qa')->whereNotNull('qa')->get();

        return [
            'totalResponses' => File::count(),
            'qaCount'        => File::where('type', 'qa')->count(),
            'soundCount'     => File::where('type', 'soundRecord')->count(),
            'emailSent'      => File::where('email_status', 'sent')->count(),
            'emailPending'   => File::where('email_status', 'pending')->count(),
            'emailFailed'    => File::where('email_status', 'failed')->count(),
            'questionStats'  => $this->buildQuestionStats($questions, $qaFiles),
        ];
    }

    private function buildQuestionStats(Collection $questions, Collection $qaFiles): Collection
    {
        return $questions->map(fn (Question $question) => $this->statsForQuestion($question, $qaFiles));
    }

    private function statsForQuestion(Question $question, Collection $qaFiles): array
    {
        $ratings = [];

        foreach ($qaFiles as $file) {
            $qa = $file->qa;
            if (! is_array($qa)) {
                continue;
            }
            foreach ($qa as $answer) {
                if (($answer['question']['id'] ?? null) == $question->id && isset($answer['value'])) {
                    $ratings[] = (int) $answer['value'];
                }
            }
        }

        $dist = array_fill_keys([0, 1, 2, 3, 4], 0);
        foreach ($ratings as $r) {
            if (array_key_exists($r, $dist)) {
                $dist[$r]++;
            }
        }

        return [
            'id'           => $question->id,
            'text'         => $question->text,
            'text_ar'      => $question->text_ar,
            'count'        => count($ratings),
            'average'      => count($ratings) > 0 ? round(array_sum($ratings) / count($ratings), 2) : null,
            'distribution' => $dist,
        ];
    }
}
