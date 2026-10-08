<?php

namespace Tests\Feature;

use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPageImageSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_upload_replacement_photos_for_initiative_areas_and_see_them_publicly(): void
    {
        $editor = $this->editor('initiative-page-images@example.test');
        $image = $this->image($editor, 'initiative-nature-ai.jpg');

        $this->actingAs($editor)
            ->get(route('admin.initiatives.images'))
            ->assertOk()
            ->assertSee('Konservasi Alam')
            ->assertSee('name="images[nature]"', false);

        $this->post(route('admin.initiatives.images.update'), [
            'images' => ['nature' => $image->id],
        ])->assertRedirect(route('admin.initiatives.images'));

        $this->assertDatabaseHas('SiteSetting', [
            'key' => 'initiative_area_images',
            'value' => json_encode([
                'nature' => $image->id,
                'community' => null,
                'research' => null,
                'climate' => null,
            ]),
        ]);

        $this->get('/inisiatif')
            ->assertOk()
            ->assertSee('src="/media-file/uploads/initiative-nature-ai.jpg"', false);
    }

    public function test_admin_can_replace_knowledge_page_feature_and_publication_photos(): void
    {
        $editor = $this->editor('knowledge-page-images@example.test');
        $image = $this->image($editor, 'knowledge-assessment-ai.jpg');

        $this->actingAs($editor)
            ->get(route('admin.knowledge.images'))
            ->assertOk()
            ->assertSee('Cerita Lapangan Unggulan')
            ->assertSee('name="images[assessment]"', false);

        $this->post(route('admin.knowledge.images.update'), [
            'images' => ['assessment' => $image->id],
        ])->assertRedirect(route('admin.knowledge.images'));

        $this->get('/pengetahuan')
            ->assertOk()
            ->assertSee('src="/media-file/uploads/knowledge-assessment-ai.jpg"', false);
    }

    public function test_page_image_settings_reject_non_image_media(): void
    {
        $editor = $this->editor('invalid-page-image@example.test');
        $document = Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'report.pdf',
            'originalName' => 'report.pdf',
            'mimeType' => 'application/pdf',
            'size' => 10,
            'storageKey' => 'uploads/report.pdf',
            'url' => '/media-file/uploads/report.pdf',
            'uploadedById' => $editor->id,
        ]);

        $this->actingAs($editor)
            ->from(route('admin.knowledge.images'))
            ->post(route('admin.knowledge.images.update'), [
                'images' => ['field_story' => $document->id],
            ])
            ->assertRedirect(route('admin.knowledge.images'))
            ->assertSessionHasErrors('images.field_story');

        $this->assertDatabaseMissing('SiteSetting', ['key' => 'knowledge_page_images']);
    }

    private function editor(string $email): User
    {
        return User::create([
            'name' => 'Page Image Editor',
            'email' => $email,
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
    }

    private function image(User $user, string $filename): Media
    {
        return Media::create([
            'type' => MediaType::IMAGE,
            'filename' => $filename,
            'originalName' => $filename,
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/'.$filename,
            'url' => '/media-file/uploads/'.$filename,
            'uploadedById' => $user->id,
        ]);
    }
}
