<?php

namespace App\Http\Controllers;

use App\Http\Resources\FileResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => ['required']
        ]);
        $file=$request->file('file');

        $user=$request->user();
        $file=(new FileController)->upload($file,'temp' , $user->id, 'User');
        return new FileResource($file);
    }

}
