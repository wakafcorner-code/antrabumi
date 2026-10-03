<?php

namespace Tests\Feature;

use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMediaLibraryActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_media_library_exposes_upload_and_metadata_actions_but_not_delete(): void
    {
        $editor = $this->user(Role::EDITOR, 'media-library-editor@example.test');
        $media = $this->media($editor);

        $this->actingAs($editor)
            ->get(route('admin.media.index'))
            ->assertOk()
            ->assertSee('id="media-upload-input"', false)
            ->assertSee('name="altText"', false)
            ->assertSee('name="caption"', false)
            ->assertSee('name="attribution"', false)
            ->assertSee(route('admin.media.update', $media), false)
            ->assertDontSee(route('api.media.destroy', $media), false);
    }

    public function test_admin_media_library_exposes_delete_action(): void
    {
        $admin = $this->user(Role::ADMIN, 'media-library-admin@example.test');
        $media = $this->media($admin);

        $this->actingAs($admin)
            ->get(route('admin.media.index'))
            ->assertOk()
            ->assertSee(route('api.media.destroy', $media), false);
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

    private function media(User $uploader): Media
    {
        return Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'library-photo.jpg',
            'originalName' => 'library-photo.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/library-photo.jpg',
            'url' => '/media-file/uploads/library-photo.jpg',
            'uploadedById' => $uploader->id,
        ]);
    }
}