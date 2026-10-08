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

    public function test_settings_logo_upload_controls_show_preview_and_save_instructions(): void
    {
        $admin = User::create([
            'name' => 'Settings Logo Admin',
            'email' => 'settings-logo-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.settings.index'))
            ->assertOk()
            ->assertSee('data-logo-preview-for="site_logo_url"', false)
            ->assertSee('data-logo-preview-for="site_logo_dark_url"', false)
            ->assertSee('data-logo-upload-status', false)
            ->assertSee('Klik Simpan Pengaturan untuk menerapkan logo.', false)
            ->assertSee('<meta name="media-upload-url" content="'.route('api.media.upload', [], false).'">', false);
    }

    public function test_uploaded_logo_url_can_be_saved_and_is_used_by_public_layout(): void
    {
        $admin = User::create([
            'name' => 'Settings Logo Save Admin',
            'email' => 'settings-logo-save-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $logoUrl = '/media-file/uploads/site-logo.png';

        $this->actingAs($admin)
            ->put(route('admin.settings.update'), [
                'site_logo_url' => $logoUrl,
                'site_logo_dark_url' => $logoUrl,
            ])
            ->assertRedirect(route('admin.settings.index'));

        $this->assertSame($logoUrl, SiteSetting::where('key', 'site_logo_url')->value('value'));
        $this->assertSame($logoUrl, SiteSetting::where('key', 'site_logo_dark_url')->value('value'));

        $this->get('/')
            ->assertOk()
            ->assertSee('src="'.$logoUrl.'"', false);
    }

    public function test_settings_social_url_saves_when_another_social_field_is_blank(): void
    {
        $admin = User::create([
            'name' => 'Settings Social Admin',
            'email' => 'settings-social-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($admin)
            ->put(route('admin.settings.update'), [
                'instagram_url' => 'https://instagram.com/antrabumi_org',
                'linkedin_url' => '',
            ])
            ->assertRedirect(route('admin.settings.index'))
            ->assertSessionHasNoErrors();

        $this->assertSame(
            'https://instagram.com/antrabumi_org',
            SiteSetting::where('key', 'instagram_url')->value('value')
        );
    }

    public function test_people_index_shows_the_uploaded_profile_photo(): void
    {
        $admin = User::create([
            'name' => 'People Photo Admin',
            'email' => 'people-photo-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $image = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'people-photo.jpg',
            'originalName' => 'people-photo.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/people-photo.jpg',
            'url' => '/media-file/uploads/people-photo.jpg',
            'uploadedById' => $admin->id,
        ]);
        $person = Person::create([
            'slug' => 'people-photo-admin',
            'imageId' => $image->id,
            'status' => \App\Enums\ContentStatus::DRAFT,
            'createdById' => $admin->id,
            'updatedById' => $admin->id,
        ]);
        $person->translations()->create(['language' => \App\Enums\Language::ID, 'name' => 'People Photo Admin']);

        $this->actingAs($admin)
            ->get(route('admin.people.index'))
            ->assertOk()
            ->assertSee('src="/media-file/uploads/people-photo.jpg"', false)
            ->assertSee('Foto', false);
    }

    public function test_settings_validation_error_does_not_render_missing_translation_key(): void
    {
        $admin = User::create([
            'name' => 'Settings Validation Admin',
            'email' => 'settings-validation-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->followingRedirects()
            ->actingAs($admin)
            ->from(route('admin.settings.index'))
            ->put(route('admin.settings.update'), ['site_name' => 123])
            ->assertOk()
            ->assertDontSee('validation.string')
            ->assertSee('site_name')
            ->assertSee('Kolom site name harus berupa teks.');
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

    public function test_partner_create_shows_a_clear_error_for_an_invalid_logo_url(): void
    {
        $admin = User::create([
            'name' => 'Partner URL Admin',
            'email' => 'partner-url-admin@example.test',
            'role' => Role::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($admin)
            ->from(route('admin.partners.create'))
            ->post(route('admin.partners.store'), [
                'name' => 'Example Partner',
                'slug' => 'example-partner',
                'logoMediaIdUrl' => 'not-a-valid-url',
            ])
            ->assertRedirect(route('admin.partners.create'))
            ->assertSessionHasErrors('logoMediaIdUrl');

        $this->get(route('admin.partners.create'))
            ->assertOk()
            ->assertSee('Masukkan URL logo yang valid dan diawali http:// atau https://.')
            ->assertDontSee('validation:url');
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
