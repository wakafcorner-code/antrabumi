<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\KnowledgeType;
use App\Enums\Language;
use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Knowledge;
use App\Models\KnowledgeDownload;
use App\Models\KnowledgeTranslation;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicKnowledgePagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_listing_keeps_source_order_language_and_query_filter_semantics(): void
    {
        $user = $this->editor();
        $article = $this->knowledge($user, 'article-field-note', KnowledgeType::ARTICLE, ContentStatus::PUBLISHED, '2026-01-01');
        $research = $this->knowledge($user, 'research-report', KnowledgeType::RESEARCH_PUBLICATION, ContentStatus::PUBLISHED, '2026-03-01');
        $this->knowledge($user, 'draft-report', KnowledgeType::RESEARCH_PUBLICATION, ContentStatus::DRAFT, '2026-04-01');
        $this->translation($article, Language::ID, 'Catatan Lapangan', 'Pembelajaran dari lapangan');
        $this->translation($article, Language::EN, 'Field Note', 'Learning from the field');
        $this->translation($research, Language::ID, 'Laporan Riset', 'Ringkasan laporan riset');
        $this->translation($research, Language::EN, 'Research Report', 'Research report summary');

        $this->disableCookieEncryption()
            ->withCookie('antrabumi_lang', 'EN')
            ->get('/pengetahuan?kategori=riset')
            ->assertOk()
            ->assertSee('<title>Knowledge — ANTRABUMI</title>', false)
            ->assertSee('aria-label="Knowledge categories"', false)
            ->assertSee('Research, Assessment & Knowledge')
            ->assertSee('data-initial-type="RESEARCH_PUBLICATION"', false)
            ->assertSee('data-type="RESEARCH_PUBLICATION"', false)
            ->assertSee('Research Report')
            ->assertSee('title="PDF preview"', false)
            ->assertDontSee('title="Pratinjau PDF"', false)
            ->assertDontSee('draft-report');

        $this->withCookie('antrabumi_lang', 'ID')
            ->get('/pengetahuan')
            ->assertOk()
            ->assertSee('title="Pratinjau PDF"', false)
            ->assertSee('Pembaca & Pratinjau Dokumen')
            ->assertDontSee('title="PDF preview"', false);
    }

    public function test_detail_renders_fallback_translation_media_order_and_metadata(): void
    {
        $user = $this->editor();
        $knowledge = $this->knowledge($user, 'published-assessment', KnowledgeType::RESEARCH_PUBLICATION, ContentStatus::PUBLISHED, '2026-02-03');
        $this->translation($knowledge, Language::ID, 'Assessment title', 'Indonesian excerpt', '<p>Indonesian body</p>');
        $this->translation($knowledge, Language::EN, '', 'English excerpt', '<p>English body</p>');
        $cover = $this->media($user, 'cover.jpg', '/uploads/cover.jpg', MediaType::IMAGE, 'image/jpeg');
        $gallery = $this->media($user, 'gallery.jpg', '/uploads/gallery.jpg', MediaType::IMAGE, 'image/jpeg');
        $pdfLater = $this->media($user, 'later.pdf', '/uploads/later.pdf', MediaType::DOCUMENT, 'application/pdf');
        $pdfFirst = $this->media($user, 'first.pdf', '/uploads/first.pdf', MediaType::DOCUMENT, 'application/pdf');
        $pdfFirst->update(['url' => 'https://drive.google.com/file/d/DriveReport123/view?usp=sharing']);
        $knowledge->update(['coverMediaId' => $cover->id]);
        $knowledge->gallery()->attach($gallery->id, ['order' => 1]);
        KnowledgeDownload::create(['knowledgeId' => $knowledge->id, 'mediaId' => $pdfLater->id, 'label' => 'Later PDF', 'order' => 2]);
        KnowledgeDownload::create(['knowledgeId' => $knowledge->id, 'mediaId' => $pdfFirst->id, 'label' => 'First PDF', 'order' => 1]);

        $this->disableCookieEncryption()
            ->withCookie('antrabumi_lang', 'EN')
            ->get('/pengetahuan/published-assessment')
            ->assertOk()
            ->assertSee('<title>Assessment title — Knowledge ANTRABUMI</title>', false)
            ->assertSee('property="og:image" content="https://antrabumi.org/uploads/cover.jpg"', false)
            ->assertSee('English excerpt')
            ->assertSee('English body')
            ->assertDontSee('Indonesian body')
            ->assertSee('https://drive.google.com/file/d/DriveReport123/preview#toolbar=0', false)
            ->assertSee('https://drive.google.com/file/d/DriveReport123/view?usp=sharing', false)
            ->assertSee('/uploads/gallery.jpg', false)
            ->assertSee('first.pdf')
            ->assertDontSee('/uploads/later.pdf', false);
    }

    public function test_non_published_or_unknown_knowledge_slug_returns_404(): void
    {
        $user = $this->editor();
        $this->knowledge($user, 'draft-only', KnowledgeType::ARTICLE, ContentStatus::DRAFT, '2026-01-01');

        $this->get('/pengetahuan/draft-only')->assertNotFound();
        $this->get('/pengetahuan/no-such-slug')->assertNotFound();
    }

    private function editor(): User
    {
        return User::create([
            'name' => 'Knowledge Editor',
            'email' => fake()->unique()->safeEmail(),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
    }

    private function knowledge(User $user, string $slug, KnowledgeType $type, ContentStatus $status, string $publishedAt): Knowledge
    {
        return Knowledge::create([
            'slug' => $slug,
            'type' => $type,
            'status' => $status,
            'publicationDate' => $publishedAt,
            'publishedAt' => $publishedAt,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
    }

    private function translation(Knowledge $knowledge, Language $language, string $title, ?string $excerpt = null, ?string $content = null): KnowledgeTranslation
    {
        return KnowledgeTranslation::create([
            'knowledgeId' => $knowledge->id,
            'language' => $language,
            'title' => $title,
            'excerpt' => $excerpt,
            'content' => $content,
        ]);
    }

    private function media(User $user, string $filename, string $url, MediaType $type, string $mimeType): Media
    {
        return Media::create([
            'type' => $type,
            'filename' => $filename,
            'originalName' => $filename,
            'mimeType' => $mimeType,
            'size' => 1,
            'storageKey' => $filename,
            'url' => $url,
            'uploadedById' => $user->id,
        ]);
    }
}