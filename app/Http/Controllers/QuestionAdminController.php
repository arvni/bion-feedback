<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuestionAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Questions', [
            'questions' => Question::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'text'    => 'required|string|max:500',
            'text_ar' => 'nullable|string|max:500',
            'order'   => 'required|integer|min:1|max:999|unique:questions,order',
        ]);

        Question::create($request->only('text', 'text_ar', 'order'));

        return back();
    }

    public function update(Request $request, Question $question): RedirectResponse
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

    public function destroy(Question $question): RedirectResponse
    {
        $question->delete();
        return back();
    }
}
