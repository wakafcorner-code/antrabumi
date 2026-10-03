<?php

namespace App\Http\Controllers\Auth;

use App\Enums\AuditAction;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    public function create(): View
    {
        return view('auth.login');
    }

    public function store(LoginRequest $request, AuditLogService $audit): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $credentials = [
            'email' => mb_strtolower(trim($request->validated('email'))),
            'password' => $request->validated('password'),
        ];

        if (! Auth::attempt($credentials)) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'error' => 'Invalid email or password.'], 401);
            }

            throw ValidationException::withMessages(['email' => 'Invalid email or password.']);
        }

        $request->session()->regenerate();
        $user = $request->user();

        if (! $user || $user->status !== UserStatus::ACTIVE) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'error' => 'Invalid email or password.'], 401);
            }

            throw ValidationException::withMessages(['email' => 'Invalid email or password.']);
        }

        $user->forceFill(['lastLoginAt' => now()])->save();
        $audit->record($user, AuditAction::LOGIN, 'User', $user->id, ['role' => $user->role->value]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role->value]]);
        }

        return redirect()->intended(route('admin.dashboard'));
    }

    public function destroy(Request $request, AuditLogService $audit): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        $audit->record($user, AuditAction::LOGOUT, 'User', $user?->id);
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Logged out successfully.']);
        }

        return redirect()->route('login');
    }

    public function me(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        return response()->json(['success' => true, 'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->value,
            'status' => $user->status->value,
            'imageId' => $user->imageId,
            'lastLoginAt' => $user->lastLoginAt,
        ]]);
    }
}
