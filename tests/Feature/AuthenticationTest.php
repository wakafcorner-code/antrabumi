<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_user_can_login_and_open_admin_dashboard(): void
    {
        $user = User::create([
            'name' => 'ANTRABUMI Admin',
            'email' => 'admin@example.test',
            'passwordHash' => Hash::make('a-long-test-password'),
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'a-long-test-password',
        ])->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticatedAs($user);
        $this->get(route('admin.dashboard'))->assertOk();
    }

    public function test_suspended_user_cannot_login(): void
    {
        $user = User::create([
            'name' => 'Suspended User',
            'email' => 'suspended@example.test',
            'passwordHash' => Hash::make('a-long-test-password'),
            'role' => Role::ADMIN,
            'status' => UserStatus::SUSPENDED,
        ]);

        $this->from(route('login'))->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'a-long-test-password',
        ])->assertRedirect(route('login'))
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_editor_cannot_open_super_admin_user_management(): void
    {
        $user = User::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'passwordHash' => Hash::make('a-long-test-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($user)->get(route('admin.users.index'))->assertForbidden();
    }

    public function test_invalid_api_login_input_uses_next_validation_response(): void
    {
        $this->postJson(route('api.auth.login'), [
            'email' => 'not-an-email',
            'password' => 'secret',
        ])->assertStatus(400)
            ->assertExactJson([
                'success' => false,
                'error' => 'Invalid email or password.',
                'details' => ['email' => ['Invalid email format.']],
            ]);
    }

    public function test_invalid_password_returns_generic_api_error(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.test',
            'passwordHash' => Hash::make('correct-password'),
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->postJson(route('api.auth.login'), [
            'email' => 'admin@example.test',
            'password' => 'wrong-password',
        ])->assertUnauthorized()
            ->assertExactJson(['success' => false, 'error' => 'Invalid email or password.']);

        $this->assertGuest();
    }

    public function test_valid_api_login_returns_safe_user_and_authenticates_session(): void
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.test',
            'passwordHash' => Hash::make('correct-password'),
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->postJson(route('api.auth.login'), [
            'email' => 'ADMIN@example.test',
            'password' => 'correct-password',
        ])->assertOk()
            ->assertExactJson(['success' => true, 'user' => [
                'id' => $user->id,
                'name' => 'Admin',
                'email' => 'admin@example.test',
                'role' => Role::ADMIN->value,
            ]]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_authenticated_user_can_log_out(): void
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($user)
            ->postJson(route('api.auth.logout'))
            ->assertOk()
            ->assertExactJson(['success' => true, 'message' => 'Logged out successfully.']);

        $this->assertGuest();
    }

    public function test_guest_can_log_out_idempotently(): void
    {
        $this->postJson(route('api.auth.logout'))
            ->assertOk()
            ->assertExactJson(['success' => true, 'message' => 'Logged out successfully.']);
    }

    public function test_super_admin_can_manage_user_accounts(): void
    {
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@example.test',
            'passwordHash' => 'password-123',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($superAdmin)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertSee('Super Admin');

        $this->actingAs($superAdmin)
            ->get(route('admin.users.create'))
            ->assertOk()
            ->assertDontSee('name="status"', false);

        $this->actingAs($superAdmin)
            ->post(route('admin.users.store'), [
                'name' => 'New Editor',
                'email' => 'editor@example.test',
                'role' => Role::EDITOR->value,
                'password' => 'editor-password',
            ])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHas('success');

        $editor = User::where('email', 'editor@example.test')->firstOrFail();
        $this->assertSame(Role::EDITOR->value, $editor->role->value);
        $this->assertSame(UserStatus::ACTIVE->value, $editor->status->value);

        $this->actingAs($superAdmin)
            ->from(route('admin.users.create'))
            ->post(route('admin.users.store'), [
                'name' => str_repeat('N', 101),
                'email' => 'invalid-length@example.test',
                'role' => Role::EDITOR->value,
                'password' => str_repeat('p', 101),
            ])
            ->assertRedirect(route('admin.users.create'))
            ->assertSessionHasErrors(['name', 'password']);

        $this->actingAs($superAdmin)
            ->patch(route('admin.users.role', $editor), ['role' => Role::ADMIN->value])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHas('success');

        $this->actingAs($superAdmin)
            ->patch(route('admin.users.status', $editor), ['status' => UserStatus::SUSPENDED->value])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHas('success');

        $this->actingAs($superAdmin)
            ->from(route('admin.users.index'))
            ->patch(route('admin.users.password', $editor), [
                'password' => 'new-secret-pass',
                'confirmPassword' => 'different-secret-pass',
            ])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHasErrors('confirmPassword');

        $this->assertTrue(Hash::check('editor-password', $editor->fresh()->passwordHash));

        $this->actingAs($superAdmin)
            ->patch(route('admin.users.password', $editor), [
                'password' => 'new-secret-pass',
                'confirmPassword' => 'new-secret-pass',
            ])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHas('success');

        $editor->refresh();
        $this->assertTrue(Hash::check('new-secret-pass', $editor->passwordHash));
        $this->assertSame(UserStatus::SUSPENDED->value, $editor->status->value);
        $passwordAudit = AuditLog::query()
            ->where('entity', 'User')
            ->where('entityId', $editor->id)
            ->get()
            ->first(fn (AuditLog $log): bool => ($log->metadata['action'] ?? null) === 'password_changed');
        $this->assertNotNull($passwordAudit);
        $this->assertSame(['action' => 'password_changed'], $passwordAudit->metadata);
    }

    public function test_guest_is_redirected_from_protected_dashboard(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    }

    public function test_user_search_uses_q_for_name_and_email_without_matching_role(): void
    {
        $superAdmin = User::create([
            'name' => 'Search Super Admin',
            'email' => 'search-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        User::create([
            'name' => 'Name Needle Account',
            'email' => 'name-target@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        User::create([
            'name' => 'Email Match Account',
            'email' => 'email-needle@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        User::create([
            'name' => 'Role Only Account',
            'email' => 'role-only@example.test',
            'role' => Role::AUTHOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($superAdmin)
            ->get(route('admin.users.index', ['q' => 'Name Needle']))
            ->assertOk()
            ->assertSee('name-target@example.test')
            ->assertDontSee('email-needle@example.test');

        $this->get(route('admin.users.index', ['q' => 'email-needle']))
            ->assertOk()
            ->assertSee('email-needle@example.test')
            ->assertDontSee('name-target@example.test');

        $this->get(route('admin.users.index', ['q' => '']))
            ->assertOk()
            ->assertSee('name-target@example.test')
            ->assertSee('email-needle@example.test')
            ->assertSee('role-only@example.test');

        $this->get(route('admin.users.index', ['q' => 'AUTHOR']))
            ->assertOk()
            ->assertDontSee('role-only@example.test')
            ->assertSee('Tidak ada pengguna.');

        $this->get(route('admin.users.index', ['search' => 'Name Needle']))
            ->assertOk()
            ->assertSee('name-target@example.test')
            ->assertDontSee('email-needle@example.test');
    }

    public function test_user_management_does_not_expose_a_delete_action_absent_from_next(): void
    {
        $superAdmin = User::create([
            'name' => 'Delete Route Auditor',
            'email' => 'delete-route-auditor@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $target = User::create([
            'name' => 'Protected Account',
            'email' => 'protected-account@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($superAdmin)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertDontSee('Hapus')
            ->assertDontSee('method="DELETE"', false);

        $this->delete('/admin/users/'.$target->id)->assertStatus(405);
        $this->assertDatabaseHas('User', ['id' => $target->id]);
    }

    public function test_user_forms_match_next_password_and_self_access_controls(): void
    {
        $superAdmin = User::create([
            'name' => 'User Form Super Admin',
            'email' => 'user-form-super@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $target = User::create([
            'name' => 'User Form Target',
            'email' => 'user-form-target@example.test',
            'passwordHash' => Hash::make('target-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($superAdmin)
            ->get(route('admin.users.create'))
            ->assertOk()
            ->assertDontSee('name="password_confirmation"', false);

        $this->get(route('admin.users.edit', $superAdmin))
            ->assertOk()
            ->assertDontSee('action="'.route('admin.users.role', $superAdmin).'"', false)
            ->assertDontSee('action="'.route('admin.users.status', $superAdmin).'"', false)
            ->assertSee('action="'.route('admin.users.update', $superAdmin).'"', false)
            ->assertSee('action="'.route('admin.users.password', $superAdmin).'"', false);

        $this->get(route('admin.users.edit', $target))
            ->assertOk()
            ->assertSee('action="'.route('admin.users.role', $target).'"', false)
            ->assertSee('action="'.route('admin.users.status', $target).'"', false);
    }

    public function test_user_profile_updates_are_partial_and_leave_access_and_password_unchanged(): void
    {
        $superAdmin = User::create([
            'name' => 'Profile Super Admin',
            'email' => 'profile-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $target = User::create([
            'name' => 'Original Name',
            'email' => 'original-profile@example.test',
            'passwordHash' => Hash::make('original-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::SUSPENDED,
        ]);

        $this->actingAs($superAdmin)
            ->get(route('admin.users.edit', $target))
            ->assertOk()
            ->assertSee(route('admin.users.role', $target), false)
            ->assertSee(route('admin.users.status', $target), false)
            ->assertSee(route('admin.users.password', $target), false);

        $this->put(route('admin.users.update', $target), ['name' => 'Name Only Update'])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHas('success');
        $target->refresh();
        $this->assertSame('Name Only Update', $target->name);
        $this->assertSame('original-profile@example.test', $target->email);

        $this->put(route('admin.users.update', $target), ['email' => 'email-only@example.test'])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHas('success');
        $target->refresh();
        $this->assertSame('Name Only Update', $target->name);
        $this->assertSame('email-only@example.test', $target->email);

        $this->from(route('admin.users.edit', $target))
            ->put(route('admin.users.update', $target), ['name' => 'A'])
            ->assertRedirect(route('admin.users.edit', $target))
            ->assertSessionHasErrors('name');

        $this->put(route('admin.users.update', $target), [
            'name' => 'Both Fields Updated',
            'email' => 'both-fields@example.test',
            'role' => Role::ADMIN->value,
            'status' => UserStatus::ACTIVE->value,
            'password' => 'unexpected-password-change',
        ])->assertRedirect(route('admin.users.index'))
            ->assertSessionHas('success');

        $target->refresh();
        $this->assertSame('Both Fields Updated', $target->name);
        $this->assertSame('both-fields@example.test', $target->email);
        $this->assertSame(Role::EDITOR, $target->role);
        $this->assertSame(UserStatus::SUSPENDED, $target->status);
        $this->assertTrue(Hash::check('original-password', $target->passwordHash));
    }

    public function test_non_super_admin_cannot_update_user_profile(): void
    {
        $editor = User::create([
            'name' => 'Profile Editor',
            'email' => 'profile-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $target = User::create([
            'name' => 'Protected User',
            'email' => 'protected-user@example.test',
            'role' => Role::AUTHOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->put(route('admin.users.update', $target), ['name' => 'Changed Name'])
            ->assertForbidden();

        $this->assertSame('Protected User', $target->fresh()->name);
    }

    public function test_unauthenticated_current_user_request_is_rejected(): void
    {
        $this->getJson(route('api.auth.me'))->assertUnauthorized()
            ->assertExactJson(['success' => false, 'error' => 'Unauthorized']);
    }

    public function test_inactive_user_session_is_rejected_from_current_user_api(): void
    {
        $user = User::create([
            'name' => 'Suspended User',
            'email' => 'suspended@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $this->actingAs($user);
        $user->update(['status' => UserStatus::SUSPENDED]);

        $this->getJson(route('api.auth.me'))->assertUnauthorized()
            ->assertExactJson(['success' => false, 'error' => 'Unauthorized']);

        $this->assertGuest();
    }
}
