<?php

namespace Tests\Feature;

use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_can_upload_valid_image_and_store_media_reference(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR);

        $response = $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->image('field-photo.png', 640, 480),
            'altText' => 'Kegiatan lapangan',
        ]);

        $response->assertOk()->assertJsonPath('success', true);
        $this->assertSame(['id', 'filename', 'url', 'type', 'size', 'altText'], array_keys($response->json('data')));
        $media = Media::findOrFail($response->json('data.id'));
        $this->assertSame(MediaType::IMAGE, $media->type);
        $this->assertSame($editor->id, $media->uploadedById);
        $this->assertSame('Kegiatan lapangan', $media->altText);
        $this->assertSame(640, $media->width);
        Storage::disk('public')->assertExists($media->storageKey);
    }

    public function test_editor_can_upload_a_valid_pdf_document(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR);

        $response = $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('field-report.pdf', "%PDF-1.7\nReport content"),
        ]);

        $response->assertOk()->assertJsonPath('data.type', MediaType::DOCUMENT->value);
        $media = Media::findOrFail($response->json('data.id'));
        $this->assertSame('application/pdf', $media->mimeType);
        Storage::disk('public')->assertExists($media->storageKey);
    }

    public function test_svg_gallery_upload_is_rejected_without_storing_raw_content(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR);

        $response = $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('gallery.svg', '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(1)</script></svg>'),
        ]);

        $response->assertBadRequest()->assertJsonPath('success', false);
        $this->assertSame(0, Media::count());
        $this->assertSame([], Storage::disk('public')->allFiles());
    }

    public function test_upload_rejects_fake_image_content_and_svg(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR);

        $this->actingAs($editor)->postJson(route('api.media.upload'))
            ->assertBadRequest()
            ->assertExactJson([
                'success' => false,
                'error' => 'File tidak ditemukan dalam form upload.',
            ]);

        $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('fake.png', 'not an image'),
        ])->assertBadRequest()->assertJsonStructure(['success', 'error'])->assertJsonPath('success', false);

        $this->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('active.svg', '<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
        ])->assertBadRequest()->assertJsonStructure(['success', 'error'])->assertJsonPath('success', false);

        $this->assertSame(0, Media::count());
    }

    public function test_upload_rejects_files_larger_than_fifteen_megabytes(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR);

        $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->create('large.png', 15361, 'image/png'),
        ])->assertBadRequest()->assertJsonStructure(['success', 'error'])->assertJsonPath('success', false);

        $this->assertSame(0, Media::count());
    }

    public function test_unusual_original_filename_is_sanitized_and_stored_under_random_path(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR);
        $file = UploadedFile::fake()->image('../../field\\photo.png');

        $response = $this->actingAs($editor)->postJson(route('api.media.upload'), ['file' => $file]);

        $response->assertOk();
        $media = Media::findOrFail($response->json('data.id'));
        $this->assertStringStartsWith('uploads/', $media->storageKey);
        $this->assertStringNotContainsString('/', $media->originalName);
        $this->assertStringNotContainsString('..', $media->originalName);
        Storage::disk('public')->assertExists($media->storageKey);
    }

    public function test_admin_deleting_media_removes_its_stored_file_and_database_row(): void
    {
        Storage::fake('public');
        $admin = $this->user(Role::ADMIN);
        Storage::disk('public')->put('uploads/delete-me.png', 'image bytes');
        $media = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'delete-me.png',
            'originalName' => 'delete-me.png',
            'mimeType' => 'image/png',
            'size' => 11,
            'storageKey' => 'uploads/delete-me.png',
            'uploadedById' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->deleteJson(route('api.media.destroy', $media))
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('Media', ['id' => $media->id]);
        Storage::disk('public')->assertMissing('uploads/delete-me.png');
    }

    public function test_author_cannot_upload_media(): void
    {
        Storage::fake('public');
        $author = $this->user(Role::AUTHOR);

        $this->actingAs($author)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->image('field-photo.png'),
        ])->assertForbidden()->assertExactJson([
            'success' => false,
            'error' => 'FORBIDDEN: Insufficient permissions.',
        ]);

        $this->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('gallery.svg', '<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
        ])->assertForbidden()->assertExactJson([
            'success' => false,
            'error' => 'FORBIDDEN: Insufficient permissions.',
        ]);

        $this->assertSame(0, Media::count());
    }

    public function test_guest_api_upload_returns_json_unauthorized_without_accept_header(): void
    {
        $this->post(route('api.media.upload'))
            ->assertUnauthorized()
            ->assertExactJson(['success' => false, 'error' => 'Unauthorized']);
    }

    private function user(Role $role): User
    {
        return User::create([
            'name' => $role->value,
            'email' => strtolower($role->value).'@example.test',
            'role' => $role,
            'status' => UserStatus::ACTIVE,
        ]);
    }
}
