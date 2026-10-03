<?php

namespace Tests\Feature;

use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMediaLibrarySearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_media_search_matches_alt_text(): void
    {
        $editor = User::create([
            'name' => 'Media Search Editor',
            'email' => 'media-search-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'field-image-001.jpg',
            'originalName' => 'field-image-001.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/field-image-001.jpg',
            'url' => '/media-file/uploads/field-image-001.jpg',
            'altText' => 'Community mapping workshop in Belitung',
            'uploadedById' => $editor->id,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.media.index', ['search' => 'mapping']))
            ->assertOk()
            ->assertSee('name="search"', false)
            ->assertSee('field-image-001.jpg');
    }

    public function test_media_search_accepts_the_next_query_parameter(): void
    {
        $editor = User::create([
            'name' => 'Media Query Editor',
            'email' => 'media-query-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'campaign-photo.jpg',
            'originalName' => 'campaign-photo.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/campaign-photo.jpg',
            'url' => '/media-file/uploads/campaign-photo.jpg',
            'uploadedById' => $editor->id,
        ]);
        Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'unrelated-photo.jpg',
            'originalName' => 'unrelated-photo.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/unrelated-photo.jpg',
            'url' => '/media-file/uploads/unrelated-photo.jpg',
            'uploadedById' => $editor->id,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.media.index', ['q' => 'campaign-photo']))
            ->assertOk()
            ->assertSee('campaign-photo.jpg')
            ->assertDontSee('unrelated-photo.jpg');
    }
}