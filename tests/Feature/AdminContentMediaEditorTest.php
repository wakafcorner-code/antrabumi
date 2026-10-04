<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\KnowledgeType;
use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Experience;
use App\Models\Knowledge;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use App\Services\PublicSiteData;
use Tests\TestCase;

class AdminContentMediaEditorTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_can_upload_initiative_cover_and_gallery_media_during_creation(): void
    {
        $editor = $this->editor('initiative-media-editor@example.test');
        $cover = $this->image($editor, 'initiative-cover.jpg');
        $gallery = $this->image($editor, 'initiative-gallery.jpg');

        $this->actingAs($editor)
            ->get(route('admin.initiatives.create'))
            ->assertOk()
            ->assertSee('data-media-image-upload', false)
            ->assertSee('data-media-gallery-files', false);

        $this->post(route('admin.initiatives.store'), [
            'slug' => 'initiative-with-gallery',
            'type' => 'INITIATIVE',
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'Initiative with gallery',
            'coverMediaId' => $cover->id,
            'galleryMediaIds' => [$gallery->id],
        ])->assertRedirect();

        $initiative = Experience::where('slug', 'initiative-with-gallery')->firstOrFail();
        $this->assertSame($cover->id, $initiative->coverMediaId);
        $this->assertDatabaseHas('ExperienceMedia', ['experienceId' => $initiative->id, 'mediaId' => $gallery->id]);
    }

    public function test_editor_can_save_gallery_images_with_new_knowledge_and_use_long_form_editor(): void
    {
        $editor = $this->editor('knowledge-media-editor@example.test');
        $gallery = $this->image($editor, 'knowledge-gallery.jpg');

        $this->actingAs($editor)
            ->get(route('admin.knowledge.create'))
            ->assertOk()
            ->assertSee('data-rich-editor', false)
            ->assertSee('data-media-gallery-files', false);

        $this->post(route('admin.knowledge.store'), [
            'slug' => 'knowledge-with-gallery',
            'type' => KnowledgeType::ARTICLE->value,
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'Knowledge with gallery',
            'bodyId' => '<h2>Long form section</h2><p>Article paragraph.</p>',
            'galleryMediaIds' => [$gallery->id],
        ])->assertRedirect(route('admin.knowledge.index'));

        $knowledge = Knowledge::where('slug', 'knowledge-with-gallery')->firstOrFail();
        $this->assertDatabaseHas('KnowledgeMedia', ['knowledgeId' => $knowledge->id, 'mediaId' => $gallery->id]);
        $this->assertSame(
            '<h2>Long form section</h2><p>Article paragraph.</p>',
            $knowledge->translations()->where('language', 'ID')->value('content')
        );
    }

    public function test_gallery_upload_validation_only_accepts_image_media(): void
    {
        $editor = $this->editor('invalid-gallery-media@example.test');
        $document = Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'report.pdf',
            'originalName' => 'report.pdf',
            'mimeType' => 'application/pdf',
            'size' => 10,
            'storageKey' => 'uploads/report.pdf',
            'url' => '/storage/uploads/report.pdf',
            'uploadedById' => $editor->id,
        ]);

        $this->actingAs($editor)
            ->from(route('admin.knowledge.create'))
            ->post(route('admin.knowledge.store'), [
                'slug' => 'invalid-gallery-media',
                'type' => KnowledgeType::ARTICLE->value,
                'titleId' => 'Invalid gallery media',
                'galleryMediaIds' => [$document->id],
            ])
            ->assertRedirect(route('admin.knowledge.create'))
            ->assertSessionHasErrors('galleryMediaIds.0');

        $this->assertDatabaseMissing('Knowledge', ['slug' => 'invalid-gallery-media']);
    }

    public function test_old_absolute_local_media_urls_are_normalized_for_homepage_and_admin_upload_uses_relative_endpoint(): void
    {
        Storage::fake('public');
        $editor = $this->editor('home-media-url-editor@example.test');
        $storageKey = 'uploads/home-hero.jpg';
        Storage::disk('public')->put($storageKey, 'test image');
        $oldUrl = 'http://127.0.0.1:8001/media-file/'.$storageKey;
        $media = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'home-hero.jpg',
            'originalName' => 'home-hero.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 10,
            'storageKey' => $storageKey,
            'url' => $oldUrl,
            'uploadedById' => $editor->id,
        ]);
        SiteSetting::create([
            'key' => 'home_hero_slides',
            'value' => json_encode([['id' => 'hero-1', 'title' => 'Hero', 'imageUrl' => $oldUrl]], JSON_THROW_ON_ERROR),
        ]);
        SiteSetting::create([
            'key' => 'home_sections_content',
            'value' => json_encode([
                'whyUs' => ['imageUrl' => $oldUrl],
                'about' => ['diagramUrl' => $oldUrl],
            ], JSON_THROW_ON_ERROR),
        ]);

        $homepage = app(PublicSiteData::class)->homepage('ID');
        $relativeUrl = '/media-file/'.$storageKey;
        $this->assertSame($relativeUrl, $homepage['heroSlides'][0]['imageUrl']);
        $this->assertSame($relativeUrl, $homepage['homeContent']['whyUs']['imageUrl']);
        $this->assertSame($relativeUrl, $media->fresh()->url);
        $this->assertSame($relativeUrl, $homepage['homeContent']['about']['diagramUrl']);

        $this->actingAs($editor)
            ->get(route('admin.hero.index'))
            ->assertOk()
            ->assertSee('<meta name="media-upload-url" content="'.route('api.media.upload', [], false).'">', false)
            ->assertSee('value="'.$relativeUrl.'"', false);

        $this->get('/')
            ->assertOk()
            ->assertSee('src="'.$relativeUrl.'"', false);

        $this->actingAs($editor)
            ->get($relativeUrl)
            ->assertOk()
            ->assertHeader('Content-Type', 'image/jpeg');
    }

    private function editor(string $email): User
    {
        return User::create([
            'name' => 'Content Editor',
            'email' => $email,
            'passwordHash' => bcrypt('secret-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
    }

    private function image(User $editor, string $filename): Media
    {
        return Media::create([
            'type' => MediaType::IMAGE,
            'filename' => $filename,
            'originalName' => $filename,
            'mimeType' => 'image/jpeg',
            'size' => 100,
            'storageKey' => 'uploads/'.$filename,
            'url' => '/storage/uploads/'.$filename,
            'uploadedById' => $editor->id,
        ]);
    }
}
