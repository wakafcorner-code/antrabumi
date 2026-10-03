<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LayoutNavigationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_layout_renders_a_mobile_navigation_control(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('data-menu-target="public-mobile-navigation"', false)
            ->assertSee('id="public-mobile-navigation"', false);
    }

    public function test_admin_layout_renders_a_mobile_navigation_control(): void
    {
        $user = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertSee('data-menu-target="admin-navigation"', false)
            ->assertSee('id="admin-navigation"', false);
    }

    public function test_admin_navigation_contains_home_editors_and_only_shows_user_management_to_super_admin(): void
    {
        $editor = User::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertSee(route('admin.hero.index'), false)
            ->assertSee(route('admin.home-content.index'), false)
            ->assertDontSee(route('admin.users.index'), false);

        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($superAdmin)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertSee(route('admin.users.index'), false);
    }

    public function test_admin_navigation_marks_the_current_route(): void
    {
        $user = User::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($user)
            ->get(route('admin.knowledge.index'))
            ->assertOk()
            ->assertSee('aria-current="page"', false);
    }
}