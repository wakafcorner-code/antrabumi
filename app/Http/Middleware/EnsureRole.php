<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        $allowed = collect($roles)->flatMap(fn (string $role) => explode('|', $role))->filter();

        if (! $user || ! $user->role instanceof Role || ! $allowed->contains($user->role->value)) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'error' => 'FORBIDDEN: Insufficient permissions.',
                ], 403);
            }

            abort(403, 'Insufficient permissions.');
        }

        return $next($request);
    }
}
