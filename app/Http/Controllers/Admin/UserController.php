<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class UserController extends Controller
{
    protected string $resourceTitle = 'Pengguna';

    public function index(Request $request): View
    {
        $search = $request->query('q', $request->query('search', ''));
        $search = is_string($search) ? $search : '';

        $users = User::query()
            ->when($search !== '', static function ($query) use ($search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                });
            })
            ->orderByDesc('createdAt')
            ->paginate(20)
            ->appends(['q' => $search]);

        return view('admin.users.index', compact('users', 'search'));
    }

    public function create(): View
    {
        return view('admin.users.create', [
            'roles' => Role::cases(),
        ]);
    }

    public function store(Request $request, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email:rfc', 'max:255', 'unique:User,email'],
            'role' => ['required', Rule::in(array_map(static fn (Role $role): string => $role->value, Role::cases()))],
            'password' => ['required', 'string', 'min:8', 'max:100'],
        ]);

        $user = User::create([
            'name' => trim($validated['name']),
            'email' => mb_strtolower(trim($validated['email'])),
            'role' => Role::from($validated['role']),
            'status' => UserStatus::ACTIVE,
            'passwordHash' => $validated['password'],
        ]);

        $audit->record(auth()->user(), AuditAction::CREATE, 'User', $user->id, ['role' => $user->role->value]);

        return redirect()->route('admin.users.index')->with('success', 'Pengguna berhasil dibuat.');
    }

    public function edit(User $user): View
    {
        return view('admin.users.edit', [
            'user' => $user,
            'roles' => Role::cases(),
            'statuses' => UserStatus::cases(),
        ]);
    }

    public function update(Request $request, User $user, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'nullable', 'string', 'min:2', 'max:100'],
            'email' => ['sometimes', 'nullable', 'email:rfc', 'max:255', Rule::unique('User', 'email')->ignore($user->id, 'id')],
        ]);

        $updates = array_filter($validated, static fn ($value): bool => $value !== null);
        if (array_key_exists('name', $updates)) {
            $updates['name'] = trim($updates['name']);
        }
        if (array_key_exists('email', $updates)) {
            $updates['email'] = mb_strtolower(trim($updates['email']));
        }

        $user->fill($updates);
        $user->save();

        $audit->record($request->user(), AuditAction::UPDATE, 'User', $user->id, ['updated' => $updates]);

        return redirect()->route('admin.users.index')->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function updateRole(Request $request, User $user, AuditLogService $audit): RedirectResponse
    {
        abort_if($user->id === auth()->id(), 403, 'Anda tidak dapat mengubah peran akun sendiri.');

        $validated = $request->validate([
            'role' => ['required', Rule::in(array_map(static fn (Role $role): string => $role->value, Role::cases()))],
        ]);

        $previous = $user->role->value;
        $user->update(['role' => Role::from($validated['role'])]);
        $audit->record(auth()->user(), AuditAction::USER_ROLE_CHANGED, 'User', $user->id, ['from' => $previous, 'to' => $user->fresh()->role->value]);

        return redirect()->route('admin.users.index')->with('success', 'Peran pengguna berhasil diperbarui.');
    }

    public function updateStatus(Request $request, User $user, AuditLogService $audit): RedirectResponse
    {
        abort_if($user->id === auth()->id(), 403, 'Anda tidak dapat mengubah status akun sendiri.');

        $validated = $request->validate([
            'status' => ['required', Rule::in(array_map(static fn (UserStatus $status): string => $status->value, UserStatus::cases()))],
        ]);

        $user->update(['status' => UserStatus::from($validated['status'])]);
        $audit->record(auth()->user(), AuditAction::UPDATE, 'User', $user->id, ['status' => $user->status->value]);

        return redirect()->route('admin.users.index')->with('success', 'Status pengguna berhasil diperbarui.');
    }

    public function updatePassword(Request $request, User $user, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'max:100'],
            'confirmPassword' => ['required', 'string', 'same:password'],
        ]);

        $user->update(['passwordHash' => $validated['password']]);
        $audit->record($request->user(), AuditAction::UPDATE, 'User', $user->id, ['action' => 'password_changed']);

        return redirect()->route('admin.users.index')->with('success', 'Password pengguna berhasil diperbarui.');
    }
}
