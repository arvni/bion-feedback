<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $status = $request->has('status')
            ? filter_var($request->input('status'), FILTER_VALIDATE_BOOLEAN)
            : true;
        $questions = Question::where('status', $status)->orderBy('order')->get();
        return  QuestionResource::collection($questions);
    }
}
