<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Media;
use App\Models\Partner;
use App\Models\Person;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PersonPartnerMediaParityTest extends TestCase
{
    use RefreshDatabase;

    public function test_person_create_route_renders_active_photo_fields(): void
    {
        $editor = $this->user(Role::EDITOR, 'person-form@example.test');

        $this->actingAs($editor)
            ->get(route('admin.people.new'))
            ->assertOk()
            ->assertSee('name="imageId"', false)
            ->assertSee('name="imageIdUrl"', false);
    }

    public function test_person_edit_form_renders_photo_fields(): void
    {
        $editor = $this->user(Role::EDITOR, 'person-edit-form@example.test');
        $person = Person::create([
            'slug' => 'person-edit-form',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $person->translations()->create(['language' => 'ID', 'name' => 'Person Edit Form']);

        $this->actingAs($editor)
            ->get(route('admin.people.edit', $person))
            ->assertOk()
            ->assertSee('name="imageId"', false)
            ->assertSee('name="imageIdUrl"', false)
            ->assertSee('id="imageId-file"', false);
    }

    public function test_person_can_be_created_with_a_photo_uploaded_from_the_admin_form(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR, 'person-upload-photo@example.test');

        $upload = $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->image('team-photo.jpg', 640, 480),
        ])->assertOk();

        $mediaId = $upload->json('data.id');
        $mediaUrl = $upload->json('data.url');
        $this->assertStringStartsWith('/media-file/', $mediaUrl);

        $this->post(route('admin.people.store'), [
            'slug' => 'person-upload-photo',
            'nameId' => 'Uploaded Photo Person',
            'imageId' => $mediaId,
            'imageIdUrl' => $mediaUrl,
        ])->assertRedirect(route('admin.people.index'))
            ->assertSessionHasNoErrors();

        $person = Person::where('slug', 'person-upload-photo')->firstOrFail();
        $this->assertSame($mediaId, $person->imageId);
        Storage::disk('public')->assertExists('uploads/'.$upload->json('data.filename'));
    }

    public function test_person_create_generates_slug_when_form_leaves_it_blank(): void
    {
        $editor = $this->user(Role::EDITOR, 'person-slug-fallback@example.test');

        $this->actingAs($editor)
            ->from(route('admin.people.new'))
            ->post(route('admin.people.store'), [
                'nameId' => 'Person Slug Fallback',
            ])
            ->assertRedirect(route('admin.people.index'));

        $this->assertDatabaseHas('Person', ['slug' => 'person-slug-fallback']);
    }

    public function test_person_and_partner_create_ignore_status_payload_and_start_as_draft(): void
    {
        $editor = $this->user(Role::EDITOR, 'person-partner-create-status@example.test');

        $this->actingAs($editor)
            ->get(route('admin.people.new'))
            ->assertOk()
            ->assertDontSee('name="status"', false);
        $this->get(route('admin.partners.create'))
            ->assertOk()
            ->assertDontSee('name="status"', false);

        $this->post(route('admin.people.store'), [
            'slug' => 'person-status-default',
            'nameId' => 'Person Status Default',
            'status' => ContentStatus::PUBLISHED->value,
        ])->assertRedirect(route('admin.people.index'));
        $this->post(route('admin.partners.store'), [
            'name' => 'Partner Status Default',
            'slug' => 'partner-status-default',
            'status' => ContentStatus::PUBLISHED->value,
        ])->assertRedirect();

        $this->assertSame(ContentStatus::DRAFT, Person::where('slug', 'person-status-default')->firstOrFail()->status);
        $this->assertSame(ContentStatus::DRAFT, Partner::where('slug', 'partner-status-default')->firstOrFail()->status);
    }

    public function test_person_and_partner_edit_forms_keep_status_outside_profile_update(): void
    {
        $editor = $this->user(Role::EDITOR, 'person-partner-edit-status@example.test');
        $person = Person::create([
            'slug' => 'person-edit-status',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $person->translations()->create(['language' => 'ID', 'name' => 'Person Edit Status']);
        $partner = Partner::create([
            'name' => 'Partner Edit Status',
            'slug' => 'partner-edit-status',
            'status' => ContentStatus::DRAFT,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.people.edit', $person))
            ->assertOk()
            ->assertDontSee('<select id="status" name="status"', false)
            ->assertSee(route('admin.people.status', $person), false);
        $this->get(route('admin.partners.edit', $partner))
            ->assertOk()
            ->assertDontSee('<select id="status" name="status"', false)
            ->assertSee(route('admin.partners.status', $partner), false);

        $this->put(route('admin.people.update', $person), [
            'slug' => $person->slug,
            'nameId' => 'Updated Person Status',
            'status' => ContentStatus::PUBLISHED->value,
        ])->assertRedirect(route('admin.people.index'));
        $this->put(route('admin.partners.update', $partner), [
            'name' => $partner->name,
            'slug' => $partner->slug,
            'status' => ContentStatus::PUBLISHED->value,
        ])->assertRedirect(route('admin.partners.index'));

        $this->assertSame(ContentStatus::DRAFT, $person->fresh()->status);
        $this->assertSame(ContentStatus::DRAFT, $partner->fresh()->status);
    }

    public function test_person_and_partner_status_actions_return_to_edit_with_feedback(): void
    {
        $editor = $this->user(Role::EDITOR, 'person-partner-status-feedback@example.test');
        $person = Person::create([
            'slug' => 'person-status-feedback',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $person->translations()->create(['language' => 'ID', 'name' => 'Person Status Feedback']);
        $partner = Partner::create([
            'name' => 'Partner Status Feedback',
            'slug' => 'partner-status-feedback',
            'status' => ContentStatus::DRAFT,
        ]);

        $this->actingAs($editor)
            ->patch(route('admin.people.status', $person), ['status' => ContentStatus::REVIEW->value])
            ->assertRedirect(route('admin.people.edit', $person));
        $this->get(route('admin.people.edit', $person))
            ->assertOk()
            ->assertSee('Status profil tim berhasil diperbarui.');

        $this->patch(route('admin.partners.status', $partner), ['status' => ContentStatus::REVIEW->value])
            ->assertRedirect(route('admin.partners.edit', $partner));
        $this->get(route('admin.partners.edit', $partner))
            ->assertOk()
            ->assertSee('Status mitra berhasil diperbarui.');
    }

    public function test_partner_create_and_edit_forms_render_logo_fields(): void
    {
        $editor = $this->user(Role::EDITOR, 'partner-form@example.test');
        $partner = Partner::create([
            'name' => 'Form Partner',
            'slug' => 'form-partner',
            'status' => ContentStatus::DRAFT,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.partners.create'))
            ->assertOk()
            ->assertSee('name="logoMediaId"', false)
            ->assertSee('name="logoMediaIdUrl"', false);

        $this->get(route('admin.partners.edit', $partner))
            ->assertOk()
            ->assertSee('name="logoMediaId"', false)
            ->assertSee('name="logoMediaIdUrl"', false);
    }

    public function test_person_create_resolves_an_external_photo_url_to_media(): void
    {
        $editor = $this->user(Role::EDITOR, 'person-url@example.test');
        $url = 'https://images.example.test/team/send i.jpg';
        $url = str_replace(' ', '%20', $url);

        $this->actingAs($editor)
            ->post(route('admin.people.store'), [
                'slug' => 'person-external-photo',
                'nameId' => 'External Photo Person',
                'imageIdUrl' => $url,
            ])
            ->assertRedirect(route('admin.people.index'));

        $person = Person::where('slug', 'person-external-photo')->firstOrFail();
        $media = Media::findOrFail($person->imageId);
        $this->assertSame(MediaType::IMAGE, $media->type);
        $this->assertSame('image/jpeg', $media->mimeType);
        $this->assertSame(0, $media->size);
        $this->assertSame($url, $media->storageKey);
        $this->assertSame($url, $media->url);
        $this->assertSame($editor->id, $media->uploadedById);
    }

    public function test_partner_create_resolves_and_reuses_external_logo_media(): void
    {
        $editor = $this->user(Role::EDITOR, 'partner-url@example.test');
        $url = 'https://cdn.example.test/logos/partner.png';

        $this->actingAs($editor)
            ->post(route('admin.partners.store'), [
                'name' => 'External Logo Partner',
                'slug' => 'external-logo-partner',
                'logoMediaIdUrl' => $url,
            ])
            ->assertRedirect();

        $partner = Partner::where('slug', 'external-logo-partner')->firstOrFail();
        $logo = Media::findOrFail($partner->logoMediaId);
        $this->assertSame(MediaType::IMAGE, $logo->type);
        $this->assertSame('image/png', $logo->mimeType);
        $this->assertSame(0, $logo->size);
        $this->assertSame($url, $logo->storageKey);
        $this->assertSame($url, $logo->url);

        $this->post(route('admin.partners.store'), [
            'name' => 'External Logo Partner Two',
            'slug' => 'external-logo-partner-two',
            'logoMediaIdUrl' => $url,
        ])->assertRedirect();

        $secondPartner = Partner::where('slug', 'external-logo-partner-two')->firstOrFail();
        $this->assertSame($logo->id, $secondPartner->logoMediaId);
        $this->assertSame(1, Media::where('url', $url)->count());
    }

    public function test_person_can_attach_an_uploaded_image_media_id(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR, 'person-upload@example.test');
        $upload = $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->image('profile-photo.jpg', 320, 320),
        ])->assertOk()->assertJsonPath('data.type', MediaType::IMAGE->value);

        $this->post(route('admin.people.store'), [
            'slug' => 'person-uploaded-photo',
            'nameId' => 'Uploaded Photo Person',
            'imageId' => $upload->json('data.id'),
        ])->assertRedirect(route('admin.people.index'));

        $person = Person::where('slug', 'person-uploaded-photo')->firstOrFail();
        $this->assertSame($upload->json('data.id'), $person->imageId);
    }

    public function test_external_image_urls_require_http_or_https_and_editor_authorization(): void
    {
        $editor = $this->user(Role::EDITOR, 'media-url-validation@example.test');
        $this->actingAs($editor)
            ->from(route('admin.partners.create'))
            ->post(route('admin.partners.store'), [
                'name' => 'Invalid Scheme Partner',
                'slug' => 'invalid-scheme-partner',
                'logoMediaIdUrl' => 'javascript:alert(1)',
            ])
            ->assertRedirect(route('admin.partners.create'))
            ->assertSessionHasErrors('logoMediaIdUrl');

        $author = $this->user(Role::AUTHOR, 'media-url-author@example.test');
        $this->actingAs($author)
            ->post(route('admin.people.store'), [
                'slug' => 'author-external-photo',
                'nameId' => 'Author External Photo',
                'imageIdUrl' => 'https://images.example.test/blocked.jpg',
            ])
            ->assertForbidden();
        $this->post(route('admin.partners.store'), [
            'name' => 'Author External Logo',
            'slug' => 'author-external-logo',
            'logoMediaIdUrl' => 'https://images.example.test/blocked.png',
        ])->assertForbidden();

        $this->assertSame(0, Media::count());
    }

    public function test_deleting_external_media_removes_only_the_reference_record(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('uploads/logo.png', 'unrelated local file');
        $admin = $this->user(Role::ADMIN, 'external-media-delete@example.test');
        $url = 'https://cdn.example.test/logos/logo.png';
        $media = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'logo.png',
            'originalName' => 'logo.png',
            'mimeType' => 'image/png',
            'size' => 0,
            'storageKey' => $url,
            'url' => $url,
            'uploadedById' => $admin->id,
        ]);
        $partner = Partner::create([
            'name' => 'External Media Owner',
            'slug' => 'external-media-owner',
            'logoMediaId' => $media->id,
            'status' => ContentStatus::DRAFT,
        ]);

        $this->actingAs($admin)
            ->deleteJson(route('api.media.destroy', $media))
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('Media', ['id' => $media->id]);
        $this->assertNull($partner->fresh()->logoMediaId);
        Storage::disk('public')->assertExists('uploads/logo.png');
    }

    private function user(Role $role, string $email): User
    {
        return User::create([
            'name' => $role->value,
            'email' => $email,
            'role' => $role,
            'status' => UserStatus::ACTIVE,
        ]);
    }
}