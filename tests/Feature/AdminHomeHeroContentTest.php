<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminHomeHeroContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_hero_active_route_renders_an_editable_form(): void
    {
        $editor = User::create([
            'name' => 'Hero Form Editor',
            'email' => 'hero-form-editor@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.hero.index'))
            ->assertOk()
            ->assertDontSee('MIGRATION PENDING')
            ->assertSee('action="'.route('admin.hero.update').'"', false)
            ->assertSee('name="slides"', false)
            ->assertSee('name="config"', false)
            ->assertSee('value="PUT"', false);
    }

    public function test_home_content_active_route_renders_an_editable_form(): void
    {
        $editor = User::create([
            'name' => 'Home Form Editor',
            'email' => 'home-form-editor@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.home-content.index'))
            ->assertOk()
            ->assertDontSee('MIGRATION PENDING')
            ->assertSee('action="'.route('admin.home-content.update').'"', false)
            ->assertSee('name="content"', false)
            ->assertSee('value="PUT"', false);
    }

    public function test_hero_rejects_invalid_json_and_slider_config(): void
    {
        $editor = User::create([
            'name' => 'Hero Validation Editor',
            'email' => 'hero-validation-editor@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->from(route('admin.hero.index'))
            ->put(route('admin.hero.update'), [
                'slides' => '{invalid json',
                'config' => json_encode(['autoplay' => false, 'intervalMs' => 1000, 'transitionEffect' => 'spin', 'pauseOnHover' => true]),
            ])
            ->assertRedirect(route('admin.hero.index'))
            ->assertSessionHasErrors(['slides', 'config.intervalMs', 'config.transitionEffect']);

        $this->assertDatabaseMissing('SiteSetting', ['key' => 'home_hero_slides']);
    }

    public function test_home_content_rejects_invalid_json_without_persisting_it(): void
    {
        $editor = User::create([
            'name' => 'Home Validation Editor',
            'email' => 'home-validation-editor@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->from(route('admin.home-content.index'))
            ->put(route('admin.home-content.update'), ['content' => '{invalid json'])
            ->assertRedirect(route('admin.home-content.index'))
            ->assertSessionHasErrors('content');

        $this->assertDatabaseMissing('SiteSetting', ['key' => 'home_sections_content']);
    }

    public function test_editor_can_update_home_hero_and_home_content_json_settings(): void
    {
        $editor = User::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $slides = [
            [
                'id' => 'slide-1',
                'title' => 'Custom homepage title',
                'subtitle' => 'Custom subtitle',
                'primaryCtaText' => 'Contact',
                'primaryCtaLink' => '/kolaborasi',
                'secondaryCtaText' => 'About',
                'secondaryCtaLink' => '/tentang',
                'imageUrl' => '',
                'order' => 1,
                'isActive' => true,
            ],
        ];

        $content = [
            'whyUs' => ['title' => 'Why we exist', 'leadText' => 'Because context matters.'],
            'cta' => ['title' => 'Work with us'],
        ];

        $this->actingAs($editor)
            ->get(route('admin.hero.index'))
            ->assertOk();

        $this->actingAs($editor)
            ->put(route('admin.hero.update'), ['slides' => json_encode($slides), 'config' => json_encode([
                'autoplay' => false,
                'intervalMs' => 7000,
                'transitionEffect' => 'fade',
                'pauseOnHover' => true,
            ])])
            ->assertRedirect(route('admin.hero.index'))
            ->assertSessionHas('success');

        $this->assertSame(json_encode($slides, JSON_THROW_ON_ERROR), SiteSetting::where('key', 'home_hero_slides')->value('value'));
        $this->assertSame(json_encode([
            'autoplay' => false,
            'intervalMs' => 7000,
            'transitionEffect' => 'fade',
            'pauseOnHover' => true,
        ], JSON_THROW_ON_ERROR), SiteSetting::where('key', 'home_hero_slider_config')->value('value'));

        $this->actingAs($editor)
            ->get(route('admin.home-content.index'))
            ->assertOk();

        $this->actingAs($editor)
            ->put(route('admin.home-content.update'), ['content' => json_encode($content)])
            ->assertRedirect(route('admin.home-content.index'))
            ->assertSessionHas('success');

        $this->assertSame(json_encode($content, JSON_THROW_ON_ERROR), SiteSetting::where('key', 'home_sections_content')->value('value'));
    }
}
