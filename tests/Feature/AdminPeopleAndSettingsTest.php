<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Media;
use App\Models\Partner;
use App\Models\Person;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPeopleAndSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_settings_form_exposes_all_next_social_fields_and_logo_upload_controls(): void
    {
        $admin = User::create([
            'name' => 'Settings Form Admin',
            'email' => 'settings-form-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.settings.index'))
            ->assertOk()
            ->assertSee('name="youtube_url"', false)
            ->assertSee('name="twitter_url"', false)
            ->assertSee('name="facebook_url"', false)
            ->assertSee('name="whatsapp_url"', false)
            ->assertSee('id="site-logo-light-file"', false)
            ->assertSee('id="site-logo-dark-file"', false);
    }

    public function test_settings_update_rejects_values_longer_than_next_contract(): void
    {
        $admin = User::create([
            'name' => 'Settings Validation Admin',
            'email' => 'settings-validation-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($admin)
            ->from(route('admin.settings.index'))
            ->put(route('admin.settings.update'), ['site_tagline' => str_repeat('x', 5001)])
            ->assertRedirect(route('admin.settings.index'))
            ->assertSessionHasErrors('site_tagline');

        $this->assertDatabaseMissing('SiteSetting', ['key' => 'site_tagline']);
    }

    public function test_person_update_without_image_field_preserves_existing_media_relation(): void
    {
        $editor = User::create([
            'name' => 'People Media Editor',
            'email' => 'people-media-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $image = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'team-profile.jpg',
            'originalName' => 'team-profile.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/team-profile.jpg',
            'url' => '/media-file/uploads/team-profile.jpg',
            'uploadedById' => $editor->id,
        ]);
        $person = Person::create([
            'slug' => 'team-profile-media',
            'imageId' => $image->id,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $person->translations()->create(['language' => Language::ID, 'name' => 'Team Profile']);

        $this->actingAs($editor)
            ->put(route('admin.people.update', $person), [
                'slug' => $person->slug,
                'nameId' => 'Updated Team Profile',
            ])
            ->assertRedirect(route('admin.people.index'));

        $this->assertSame($image->id, $person->fresh()->imageId);
        $this->assertDatabaseHas('Media', ['id' => $image->id]);
    }

    public function test_partner_update_without_logo_field_preserves_existing_media_relation(): void
    {
        $editor = User::create([
            'name' => 'Partner Media Editor',
            'email' => 'partner-media-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $logo = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'partner-logo.png',
            'originalName' => 'partner-logo.png',
            'mimeType' => 'image/png',
            'size' => 128,
            'storageKey' => 'uploads/partner-logo.png',
            'url' => '/media-file/uploads/partner-logo.png',
            'uploadedById' => $editor->id,
        ]);
        $partner = Partner::create([
            'name' => 'Media Partner',
            'slug' => 'media-partner',
            'logoMediaId' => $logo->id,
            'status' => ContentStatus::DRAFT,
        ]);

        $this->actingAs($editor)
            ->put(route('admin.partners.update', $partner), [
                'name' => 'Updated Media Partner',
                'slug' => $partner->slug,
            ])
            ->assertRedirect(route('admin.partners.index'));

        $this->assertSame($logo->id, $partner->fresh()->logoMediaId);
        $this->assertDatabaseHas('Media', ['id' => $logo->id]);
    }

    public function test_super_admin_can_manage_people_and_site_settings(): void
    {
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.people.index'))
            ->assertOk();

        $this->actingAs($admin)
            ->post(route('admin.people.store'), [
                'slug' => 'sendi-kenia-savitri',
                'status' => ContentStatus::PUBLISHED->value,
                'order' => 1,
                'nameId' => 'Sendi Kenia Savitri',
                'degreeId' => 'M.Si.',
                'roleId' => 'Research & Assessment',
                'biographyId' => 'Bekerja di bidang riset dan pengembangan.',
                'nameEn' => 'Sendi Kenia Savitri',
                'roleEn' => 'Research & Assessment',
                'biographyEn' => 'Works in research and assessment.',
            ])
            ->assertRedirect(route('admin.people.index'))
            ->assertSessionHas('success');

        $person = Person::where('slug', 'sendi-kenia-savitri')->firstOrFail();
        $this->assertSame(ContentStatus::DRAFT->value, $person->status->value);

        $this->actingAs($admin)
            ->patch(route('admin.people.status', $person), ['status' => ContentStatus::ARCHIVED->value])
            ->assertRedirect(route('admin.people.edit', $person))
            ->assertSessionHas('success');

        $this->actingAs($admin)
            ->get(route('admin.settings.index'))
            ->assertOk();

        $this->actingAs($admin)
            ->put(route('admin.settings.update'), [
                'site_name' => 'ANTRABUMI',
                'site_tagline' => 'Connecting Knowledge, Nature, & Communities.',
                'contact_email' => 'hello@antrabumi.org',
                'contact_phone' => '+62-823-3038-7505',
            ])
            ->assertRedirect(route('admin.settings.index'))
            ->assertSessionHas('success');

        $this->assertSame('ANTRABUMI', SiteSetting::where('key', 'site_name')->value('value'));
        $this->assertSame('hello@antrabumi.org', SiteSetting::where('key', 'contact_email')->value('value'));
    }
}
