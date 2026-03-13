<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class VerifyTurnstile
{
    public function handle(Request $request, Closure $next): Response
    {
        if (app()->environment('testing', 'local')) {
            return $next($request);
        }

        $token  = $request->input('cf_turnstile_response');
        $secret = config('services.turnstile.secret');

        $valid = $token && $secret && $this->verify($token, $secret, $request->ip());

        if (! $valid) {
            return $this->fail($request);
        }

        return $next($request);
    }

    private function verify(string $token, string $secret, string $ip): bool
    {
        $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret'   => $secret,
            'response' => $token,
            'remoteip' => $ip,
        ]);

        return $response->successful() && $response->json('success') === true;
    }

    private function fail(Request $request): Response
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'CAPTCHA verification failed.'], 422);
        }

        return back()->withErrors(['cf_turnstile_response' => 'CAPTCHA verification failed. Please try again.']);
    }
}
