<?php

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveUser
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            return redirect()->guest(route('login'));
        }

        if ($user->status !== UserStatus::ACTIVE) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            return redirect()->route('login')->withErrors(['email' => 'Akun tidak aktif.']);
        }

        return $next($request);
    }
}
