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

    public function test_editor_can_save_youtube_video_links_for_initiatives_and_knowledge(): void
    {
        $editor = $this->editor('content-youtube-editor@example.test');

        $this->actingAs($editor)
            ->get(route('admin.initiatives.create'))
            ->assertOk()
            ->assertSee('id="initiative-video-youtube-url"', false)
            ->assertSee('id="initiative-video-file"', false);
        $this->post(route('admin.initiatives.store'), [
            'slug' => 'initiative-youtube-video',
            'type' => 'INITIATIVE',
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'Initiative YouTube video',
            'youtubeUrl' => 'https://youtu.be/abcdefghijk',
        ])->assertRedirect();
        $initiative = Experience::where('slug', 'initiative-youtube-video')->firstOrFail();
        $this->assertSame('https://youtu.be/abcdefghijk', $initiative->youtubeUrl);

        $this->get(route('admin.knowledge.create'))
            ->assertOk()
            ->assertSee('id="knowledge-video-youtube-url"', false)
            ->assertSee('id="knowledge-video-file"', false);
        $this->post(route('admin.knowledge.store'), [
            'slug' => 'knowledge-youtube-video',
            'type' => KnowledgeType::ARTICLE->value,
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'Knowledge YouTube video',
            'youtubeUrl' => 'https://www.youtube.com/watch?v=abcdefghijk',
        ])->assertRedirect(route('admin.knowledge.index'));
        $knowledge = Knowledge::where('slug', 'knowledge-youtube-video')->firstOrFail();
        $this->assertSame('https://www.youtube.com/watch?v=abcdefghijk', $knowledge->youtubeUrl);
    }

    public function test_editor_can_attach_and_replace_uploaded_videos_on_initiatives_and_knowledge(): void
    {
        $editor = $this->editor('content-uploaded-video-editor@example.test');
        $firstVideo = $this->video($editor, 'first-video.mp4');
        $secondVideo = $this->video($editor, 'second-video.mp4');

        $this->actingAs($editor)->post(route('admin.initiatives.store'), [
            'slug' => 'initiative-with-uploaded-video',
            'type' => 'INITIATIVE',
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'Initiative with uploaded video',
            'videoMediaId' => $firstVideo->id,
        ])->assertRedirect();
        $initiative = Experience::where('slug', 'initiative-with-uploaded-video')->firstOrFail();
        $this->assertDatabaseHas('ExperienceMedia', ['experienceId' => $initiative->id, 'mediaId' => $firstVideo->id]);
        $this->get(route('admin.initiatives.edit', $initiative))
            ->assertOk()
            ->assertSee('value="'.$firstVideo->id.'"', false);

        $this->put(route('admin.initiatives.update', $initiative), [
            'slug' => $initiative->slug,
            'type' => 'INITIATIVE',
            'titleId' => 'Initiative video replaced',
            'videoMediaId' => $secondVideo->id,
        ])->assertRedirect(route('admin.initiatives.edit', $initiative));
        $this->assertDatabaseMissing('ExperienceMedia', ['experienceId' => $initiative->id, 'mediaId' => $firstVideo->id]);
        $this->assertDatabaseHas('ExperienceMedia', ['experienceId' => $initiative->id, 'mediaId' => $secondVideo->id]);

        $this->post(route('admin.knowledge.store'), [
            'slug' => 'knowledge-with-uploaded-video',
            'type' => KnowledgeType::ARTICLE->value,
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'Knowledge with uploaded video',
            'videoMediaId' => $firstVideo->id,
        ])->assertRedirect(route('admin.knowledge.index'));
        $knowledge = Knowledge::where('slug', 'knowledge-with-uploaded-video')->firstOrFail();
        $this->assertDatabaseHas('KnowledgeMedia', ['knowledgeId' => $knowledge->id, 'mediaId' => $firstVideo->id]);

        $this->put(route('admin.knowledge.update', $knowledge), [
            'slug' => $knowledge->slug,
            'type' => KnowledgeType::ARTICLE->value,
            'titleId' => 'Knowledge video replaced',
            'videoMediaId' => $secondVideo->id,
        ])->assertRedirect(route('admin.knowledge.edit', $knowledge));
        $this->assertDatabaseMissing('KnowledgeMedia', ['knowledgeId' => $knowledge->id, 'mediaId' => $firstVideo->id]);
        $this->assertDatabaseHas('KnowledgeMedia', ['knowledgeId' => $knowledge->id, 'mediaId' => $secondVideo->id]);
    }

    public function test_invalid_youtube_urls_are_rejected_for_initiatives_and_knowledge(): void
    {
        $editor = $this->editor('invalid-youtube-editor@example.test');

        $this->actingAs($editor)
            ->from(route('admin.initiatives.create'))
            ->post(route('admin.initiatives.store'), [
                'slug' => 'initiative-invalid-youtube',
                'type' => 'INITIATIVE',
                'titleId' => 'Invalid YouTube URL',
                'youtubeUrl' => 'https://example.com/watch?v=abcdefghijk',
            ])
            ->assertRedirect(route('admin.initiatives.create'))
            ->assertSessionHasErrors('youtubeUrl');

        $this->from(route('admin.knowledge.create'))
            ->post(route('admin.knowledge.store'), [
                'slug' => 'knowledge-invalid-youtube',
                'type' => KnowledgeType::ARTICLE->value,
                'titleId' => 'Invalid YouTube URL',
                'youtubeUrl' => 'javascript:alert(1)',
            ])
            ->assertRedirect(route('admin.knowledge.create'))
            ->assertSessionHasErrors('youtubeUrl');

        $this->assertDatabaseMissing('Experience', ['slug' => 'initiative-invalid-youtube']);
        $this->assertDatabaseMissing('Knowledge', ['slug' => 'knowledge-invalid-youtube']);
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

    private function video(User $editor, string $filename): Media
    {
        return Media::create([
            'type' => MediaType::VIDEO,
            'filename' => $filename,
            'originalName' => $filename,
            'mimeType' => 'video/mp4',
            'size' => 1024,
            'storageKey' => 'uploads/'.$filename,
            'url' => '/media-file/uploads/'.$filename,
            'uploadedById' => $editor->id,
        ]);
    }
}
