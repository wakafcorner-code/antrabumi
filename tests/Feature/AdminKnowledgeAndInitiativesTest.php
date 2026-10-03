<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Enums\KnowledgeType;
use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\Experience;
use App\Models\Knowledge;
use App\Models\KnowledgeDownload;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminKnowledgeAndInitiativesTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_can_create_and_publish_knowledge(): void
    {
        $editor = User::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'passwordHash' => bcrypt('secret-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.index'))
            ->assertOk();

        $this->actingAs($editor)
            ->post(route('admin.knowledge.store'), [
                'slug' => 'idea-assessment',
                'type' => KnowledgeType::RESEARCH_PUBLICATION->value,
                'status' => ContentStatus::PUBLISHED->value,
                'authorName' => 'ANTRABUMI',
                'publicationDate' => '2026-01-15',
                'titleId' => 'Indonesia Digital Ecosystem Assessment',
                'excerptId' => 'Ringkasan studi digital ecosystem assessment.',
                'contentId' => '<p>Isi publikasi.</p>',
                'titleEn' => 'Indonesia Digital Ecosystem Assessment',
                'excerptEn' => 'Overview of the digital ecosystem assessment.',
                'contentEn' => '<p>English content.</p>',
            ])
            ->assertRedirect(route('admin.knowledge.index'))
            ->assertSessionHas('success');

        $knowledge = Knowledge::where('slug', 'idea-assessment')->firstOrFail();
        $this->assertSame(ContentStatus::PUBLISHED->value, $knowledge->status->value);
    }

    public function test_knowledge_create_and_edit_forms_expose_next_content_fields(): void
    {
        $editor = User::create([
            'name' => 'Knowledge Translation Form Editor',
            'email' => 'knowledge-translation-form@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'knowledge-translation-form',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create(['language' => Language::ID, 'title' => 'Translation form']);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.create'))
            ->assertOk()
            ->assertSee('name="bodyId"', false)
            ->assertSee('name="excerptEn"', false)
            ->assertSee('name="bodyEn"', false)
            ->assertSee('name="featured"', false)
            ->assertDontSee('name="contentId"', false);

        $this->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('name="bodyId"', false)
            ->assertSee('name="excerptEn"', false)
            ->assertSee('name="bodyEn"', false)
            ->assertSee('name="featured"', false)
            ->assertDontSee('name="contentId"', false);
    }

    public function test_knowledge_create_persists_next_payload_body_and_english_translation(): void
    {
        $editor = User::create([
            'name' => 'Knowledge Payload Editor',
            'email' => 'knowledge-payload-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->post(route('admin.knowledge.store'), [
                'slug' => 'knowledge-next-payload-create',
                'type' => KnowledgeType::ARTICLE->value,
                'status' => ContentStatus::DRAFT->value,
                'titleId' => 'Knowledge next payload create',
                'bodyId' => '<p>Indonesian body from Next form</p>',
                'titleEn' => 'Knowledge next payload create EN',
                'excerptEn' => 'English excerpt from Next form',
                'bodyEn' => '<p>English body from Next form</p>',
                'featured' => 'true',
            ])
            ->assertRedirect(route('admin.knowledge.index'));

        $knowledge = Knowledge::where('slug', 'knowledge-next-payload-create')->firstOrFail();
        $this->assertSame('<p>Indonesian body from Next form</p>', $knowledge->translations()->where('language', Language::ID)->value('content'));
        $this->assertSame('English excerpt from Next form', $knowledge->translations()->where('language', Language::EN)->value('excerpt'));
        $this->assertSame('<p>English body from Next form</p>', $knowledge->translations()->where('language', Language::EN)->value('content'));
        $this->assertTrue($knowledge->featured);
    }

    public function test_knowledge_update_persists_next_payload_body_and_english_translation(): void
    {
        $editor = User::create([
            'name' => 'Knowledge Update Payload Editor',
            'email' => 'knowledge-update-payload@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'knowledge-next-payload-update',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create(['language' => Language::ID, 'title' => 'Before update']);

        $this->actingAs($editor)
            ->put(route('admin.knowledge.update', $knowledge), [
                'slug' => $knowledge->slug,
                'type' => KnowledgeType::ARTICLE->value,
                'titleId' => 'After update',
                'bodyId' => '<p>Updated Indonesian body</p>',
                'titleEn' => 'After update EN',
                'excerptEn' => 'Updated English excerpt',
                'bodyEn' => '<p>Updated English body</p>',
                'featured' => 'true',
            ])
            ->assertRedirect(route('admin.knowledge.edit', $knowledge));

        $knowledge->refresh();
        $this->assertSame('<p>Updated Indonesian body</p>', $knowledge->translations()->where('language', Language::ID)->value('content'));
        $this->assertSame('Updated English excerpt', $knowledge->translations()->where('language', Language::EN)->value('excerpt'));
        $this->assertSame('<p>Updated English body</p>', $knowledge->translations()->where('language', Language::EN)->value('content'));
        $this->assertTrue($knowledge->featured);
    }

    public function test_editor_can_create_knowledge_without_slug_using_title_fallback(): void
    {
        $editor = User::create([
            'name' => 'Slug Fallback Editor',
            'email' => 'slug-fallback-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->post(route('admin.knowledge.store'), [
                'titleId' => 'Indonesia Digital Ecosystem Assessment',
                'type' => KnowledgeType::ARTICLE->value,
                'status' => ContentStatus::DRAFT->value,
            ])
            ->assertRedirect(route('admin.knowledge.index'))
            ->assertSessionHas('success');

        $knowledge = Knowledge::where('slug', 'indonesia-digital-ecosystem-assessment')->firstOrFail();
        $this->assertSame('Indonesia Digital Ecosystem Assessment', $knowledge->translations()->where('language', Language::ID)->value('title'));
    }

    public function test_knowledge_create_defaults_to_published_and_offers_draft_only_as_alternative(): void
    {
        $editor = User::create([
            'name' => 'Knowledge Form Editor',
            'email' => 'knowledge-form-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.create'))
            ->assertOk()
            ->assertSee('<option value="PUBLISHED" selected>Terbitkan Sekarang (PUBLISHED)</option>', false)
            ->assertSee('<option value="DRAFT">Simpan sebagai Draf (DRAFT)</option>', false)
            ->assertDontSee('value="REVIEW"', false)
            ->assertDontSee('value="ARCHIVED"', false);
    }

    public function test_knowledge_create_defaults_publication_date_to_current_utc_date(): void
    {
        $editor = User::create([
            'name' => 'Publication Date Editor',
            'email' => 'publication-date-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $today = now('UTC')->toDateString();

        $this->actingAs($editor)
            ->get(route('admin.knowledge.create'))
            ->assertOk()
            ->assertSee('name="publicationDate" value="'.$today.'"', false);
    }

    public function test_knowledge_author_name_obeys_nextjs_150_character_limit(): void
    {
        $editor = User::create([
            'name' => 'Knowledge Author Validation Editor',
            'email' => 'knowledge-author-validation@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->from(route('admin.knowledge.create'))
            ->post(route('admin.knowledge.store'), [
                'slug' => 'long-author-name-check',
                'type' => KnowledgeType::ARTICLE->value,
                'titleId' => 'Long author name check',
                'authorName' => str_repeat('A', 151),
            ])
            ->assertRedirect(route('admin.knowledge.create'))
            ->assertSessionHasErrors('authorName');

        $this->assertDatabaseMissing('Knowledge', ['slug' => 'long-author-name-check']);
    }

    public function test_knowledge_index_search_uses_q_and_matches_titles_only(): void
    {
        $editor = User::create([
            'name' => 'Knowledge Search Editor',
            'email' => 'knowledge-search-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $titleMatch = Knowledge::create([
            'slug' => 'knowledge-title-match',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $titleMatch->translations()->create([
            'language' => Language::ID,
            'title' => 'Marine Research Finding',
        ]);
        $nonTitleMatch = Knowledge::create([
            'slug' => 'marine-slug-only',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'authorName' => 'Marine Author',
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $nonTitleMatch->translations()->create([
            'language' => Language::ID,
            'title' => 'Unrelated Title',
            'excerpt' => 'Marine excerpt only',
        ]);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.index', ['q' => 'Marine']))
            ->assertOk()
            ->assertSee('Marine Research Finding')
            ->assertDontSee('Unrelated Title');

        $this->get(route('admin.knowledge.index', ['q' => '']))
            ->assertOk()
            ->assertSee('Marine Research Finding')
            ->assertSee('Unrelated Title');

        $this->get(route('admin.knowledge.index', ['search' => 'Marine']))
            ->assertOk()
            ->assertSee('Marine Research Finding')
            ->assertDontSee('Unrelated Title');
    }

    public function test_knowledge_index_sorts_by_publication_date_then_creation_date(): void
    {
        $editor = User::create([
            'name' => 'Knowledge Sort Editor',
            'email' => 'knowledge-sort-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $publishedFirst = Knowledge::create([
            'slug' => 'published-date-priority',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::PUBLISHED,
            'publishedAt' => '2026-10-02 00:00:00',
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $publishedFirst->translations()->create(['language' => Language::ID, 'title' => 'Published Date Priority']);
        $createdFirst = Knowledge::create([
            'slug' => 'created-date-priority',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::PUBLISHED,
            'publishedAt' => '2026-10-01 00:00:00',
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $createdFirst->translations()->create(['language' => Language::ID, 'title' => 'Created Date Priority']);
        DB::table('Knowledge')->where('id', $publishedFirst->id)->update(['createdAt' => '2026-10-01 00:00:00']);
        DB::table('Knowledge')->where('id', $createdFirst->id)->update(['createdAt' => '2026-10-02 00:00:00']);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.index'))
            ->assertOk()
            ->assertSeeInOrder(['Published Date Priority', 'Created Date Priority']);
    }

    public function test_knowledge_status_action_returns_to_editor_and_publishes_with_timestamp(): void
    {
        $editor = User::create([
            'name' => 'Knowledge Status Editor',
            'email' => 'knowledge-status-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'status-action-check',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create(['language' => Language::ID, 'title' => 'Status action check']);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('Status Publikasi')
            ->assertSee(route('admin.knowledge.status', $knowledge), false);

        $this->patch(route('admin.knowledge.status', $knowledge), ['status' => ContentStatus::PUBLISHED->value])
            ->assertRedirect(route('admin.knowledge.edit', $knowledge))
            ->assertSessionHas('success');

        $knowledge->refresh();
        $this->assertSame(ContentStatus::PUBLISHED, $knowledge->status);
        $this->assertNotNull($knowledge->publishedAt);

        $this->put(route('admin.knowledge.update', $knowledge), [
            'slug' => $knowledge->slug,
            'type' => KnowledgeType::ARTICLE->value,
            'titleId' => 'Updated without status field',
        ])->assertRedirect(route('admin.knowledge.edit', $knowledge));

        $this->assertSame(ContentStatus::PUBLISHED, $knowledge->fresh()->status);
    }

    public function test_knowledge_create_and_edit_forms_support_cover_media(): void
    {
        Storage::fake('public');
        $editor = User::create([
            'name' => 'Cover Media Editor',
            'email' => 'cover-media-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.create'))
            ->assertOk()
            ->assertSee('id="knowledge-cover-file"', false)
            ->assertSee('name="coverMediaId"', false);

        $mediaResponse = $this->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->image('knowledge-cover.jpg', 640, 480),
        ]);
        $mediaResponse->assertOk()->assertJsonPath('data.type', MediaType::IMAGE->value);
        $mediaId = $mediaResponse->json('data.id');

        $this->post(route('admin.knowledge.store'), [
            'slug' => 'knowledge-cover-check',
            'type' => KnowledgeType::ARTICLE->value,
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'Knowledge cover check',
            'coverMediaId' => $mediaId,
        ])->assertRedirect(route('admin.knowledge.index'));

        $knowledge = Knowledge::where('slug', 'knowledge-cover-check')->firstOrFail();
        $this->assertSame($mediaId, $knowledge->coverMediaId);

        $this->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('id="knowledge-cover-file"', false)
            ->assertSee('<input type="hidden" name="coverMediaId" id="knowledge-cover-media-id" value="'.$mediaId.'">', false)
            ->assertSee('knowledge-cover.jpg');
    }

    public function test_editor_can_create_initiatives(): void
    {
        $editor = User::create([
            'name' => 'Editor',
            'email' => 'initiatives-editor@example.test',
            'passwordHash' => bcrypt('secret-password'),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.initiatives.index'))
            ->assertOk();

        $this->actingAs($editor)
            ->post(route('admin.initiatives.store'), [
                'slug' => 'desa-ekowisata',
                'type' => 'INITIATIVE',
                'status' => ContentStatus::DRAFT->value,
                'year' => 2026,
                'category' => 'Community Development',
                'location' => 'Belitung',
                'client' => 'Komunitas Desa',
                'titleId' => 'Perencanaan Pengelolaan Ekowisata Desa',
                'excerptId' => 'Rencana awal untuk pengelolaan ekowisata desa.',
                'bodyId' => '<p>Isi inisiatif.</p>',
                'titleEn' => 'Village Ecotourism Management Planning',
                'excerptEn' => 'Initial planning for village ecotourism management.',
                'bodyEn' => '<p>English initiative description.</p>',
            ])
            ->assertRedirect(route('admin.initiatives.edit', Experience::where('slug', 'desa-ekowisata')->firstOrFail()))
            ->assertSessionHas('success');

        $initiative = Experience::where('slug', 'desa-ekowisata')->firstOrFail();
        $this->assertSame('INITIATIVE', $initiative->type);
    }

    public function test_initiative_create_redirects_to_edit_as_next_action_does(): void
    {
        $editor = User::create([
            'name' => 'Initiative Redirect Editor',
            'email' => 'initiative-redirect@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->post(route('admin.initiatives.store'), [
                'slug' => 'initiative-create-redirect',
                'type' => 'INITIATIVE',
                'titleId' => 'Initiative Create Redirect',
            ])
            ->assertRedirect(route('admin.initiatives.edit', Experience::where('slug', 'initiative-create-redirect')->firstOrFail()));
    }

    public function test_initiative_edit_uses_dedicated_status_transition_and_returns_to_edit(): void
    {
        $editor = User::create([
            'name' => 'Initiative Status Workflow Editor',
            'email' => 'initiative-status-workflow@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $initiative = Experience::create([
            'slug' => 'initiative-status-workflow',
            'type' => 'INITIATIVE',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $initiative->translations()->create(['language' => Language::ID, 'title' => 'Initiative Status Workflow']);

        $this->actingAs($editor)
            ->get(route('admin.initiatives.edit', $initiative))
            ->assertOk()
            ->assertDontSee('<select id="initiative-status" name="status"', false)
            ->assertSee(route('admin.initiatives.status', $initiative), false);

        $this->patch(route('admin.initiatives.status', $initiative), ['status' => ContentStatus::REVIEW->value])
            ->assertRedirect(route('admin.initiatives.edit', $initiative))
            ->assertSessionHas('success');

        $this->get(route('admin.initiatives.edit', $initiative))
            ->assertOk()
            ->assertSee('Status inisiatif berhasil diperbarui.');
    }

    public function test_initiative_create_and_edit_forms_expose_english_excerpt_and_body(): void
    {
        $editor = User::create([
            'name' => 'Initiative Translation Form Editor',
            'email' => 'initiative-translation-form@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $initiative = Experience::create([
            'slug' => 'initiative-translation-form',
            'type' => 'INITIATIVE',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $initiative->translations()->create(['language' => Language::ID, 'title' => 'Initiative Translation Form']);

        $this->actingAs($editor)
            ->get(route('admin.initiatives.create'))
            ->assertOk()
            ->assertSee('name="excerptEn"', false)
            ->assertSee('name="bodyEn"', false);

        $this->get(route('admin.initiatives.edit', $initiative))
            ->assertOk()
            ->assertSee('name="excerptEn"', false)
            ->assertSee('name="bodyEn"', false);
    }

    public function test_initiative_create_and_edit_forms_expose_cover_media_field(): void
    {
        $editor = User::create([
            'name' => 'Initiative Cover Form Editor',
            'email' => 'initiative-cover-form@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $initiative = Experience::create([
            'slug' => 'initiative-cover-form',
            'type' => 'INITIATIVE',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $initiative->translations()->create(['language' => Language::ID, 'title' => 'Initiative Cover Form']);

        $this->actingAs($editor)
            ->get(route('admin.initiatives.create'))
            ->assertOk()
            ->assertSee('name="coverMediaId"', false);

        $this->get(route('admin.initiatives.edit', $initiative))
            ->assertOk()
            ->assertSee('name="coverMediaId"', false);
    }

    public function test_initiative_create_and_update_persist_english_excerpt_and_body(): void
    {
        $editor = User::create([
            'name' => 'Initiative Translation Persistence Editor',
            'email' => 'initiative-translation-persistence@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->post(route('admin.initiatives.store'), [
                'slug' => 'initiative-english-content',
                'type' => 'INITIATIVE',
                'status' => ContentStatus::DRAFT->value,
                'titleId' => 'Initiative English Content',
                'titleEn' => 'Initiative English Content EN',
                'excerptEn' => 'Initial English excerpt',
                'bodyEn' => '<p>Initial English body</p>',
            ])
            ->assertRedirect(route('admin.initiatives.edit', Experience::where('slug', 'initiative-english-content')->firstOrFail()));

        $initiative = Experience::where('slug', 'initiative-english-content')->firstOrFail();
        $this->assertSame('Initial English excerpt', $initiative->translations()->where('language', Language::EN)->value('excerpt'));
        $this->assertSame('<p>Initial English body</p>', $initiative->translations()->where('language', Language::EN)->value('description'));

        $this->put(route('admin.initiatives.update', $initiative), [
            'slug' => $initiative->slug,
            'type' => 'INITIATIVE',
            'titleId' => 'Initiative English Content',
            'titleEn' => 'Updated Initiative English Content',
            'excerptEn' => 'Updated English excerpt',
            'bodyEn' => '<p>Updated English body</p>',
        ])->assertRedirect(route('admin.initiatives.edit', $initiative));

        $this->assertSame('Updated English excerpt', $initiative->translations()->where('language', Language::EN)->value('excerpt'));
        $this->assertSame('<p>Updated English body</p>', $initiative->translations()->where('language', Language::EN)->value('description'));
    }

    public function test_editor_can_attach_pdf_when_creating_initiative(): void
    {
        $editor = User::create([
            'name' => 'Initiative PDF Editor',
            'email' => 'initiative-pdf-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $pdf = Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'initiative-brief.pdf',
            'originalName' => 'initiative-brief.pdf',
            'mimeType' => 'application/pdf',
            'size' => 128,
            'storageKey' => 'uploads/initiative-brief.pdf',
            'url' => '/media-file/uploads/initiative-brief.pdf',
            'uploadedById' => $editor->id,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.initiatives.create'))
            ->assertOk()
            ->assertSee('name="pdfMediaId"', false)
            ->assertSee('name="pdfLabel"', false);

        $this->actingAs($editor)
            ->post(route('admin.initiatives.store'), [
                'slug' => 'initiative-with-pdf',
                'type' => 'INITIATIVE',
                'status' => ContentStatus::DRAFT->value,
                'titleId' => 'Initiative with PDF',
                'pdfMediaId' => $pdf->id,
            ])
            ->assertRedirect(route('admin.initiatives.edit', Experience::where('slug', 'initiative-with-pdf')->firstOrFail()));

        $initiative = Experience::where('slug', 'initiative-with-pdf')->firstOrFail();
        $this->assertDatabaseHas('ExperienceMedia', [
            'experienceId' => $initiative->id,
            'mediaId' => $pdf->id,
            'order' => 0,
        ]);
    }

    public function test_initiative_rejects_image_as_pdf_attachment(): void
    {
        $editor = User::create([
            'name' => 'Initiative PDF Validation Editor',
            'email' => 'initiative-pdf-validation@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $image = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'initiative-image.jpg',
            'originalName' => 'initiative-image.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/initiative-image.jpg',
            'url' => '/media-file/uploads/initiative-image.jpg',
            'uploadedById' => $editor->id,
        ]);

        $this->actingAs($editor)
            ->from(route('admin.initiatives.create'))
            ->post(route('admin.initiatives.store'), [
                'slug' => 'initiative-invalid-pdf',
                'type' => 'INITIATIVE',
                'titleId' => 'Initiative invalid PDF',
                'pdfMediaId' => $image->id,
            ])
            ->assertRedirect(route('admin.initiatives.create'))
            ->assertSessionHasErrors('pdfMediaId');

        $this->assertDatabaseMissing('Experience', ['slug' => 'initiative-invalid-pdf']);
    }

    public function test_initiative_edit_can_attach_and_remove_pdf_without_deleting_media(): void
    {
        Storage::fake('public');
        $editor = User::create([
            'name' => 'Initiative Edit PDF Editor',
            'email' => 'initiative-edit-pdf@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $initiative = Experience::create([
            'slug' => 'initiative-edit-pdf',
            'type' => 'INITIATIVE',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $initiative->translations()->create(['language' => Language::ID, 'title' => 'Initiative edit PDF']);
        $pdf = Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'initiative-edit-report.pdf',
            'originalName' => 'initiative-edit-report.pdf',
            'mimeType' => 'application/pdf',
            'size' => 128,
            'storageKey' => 'uploads/initiative-edit-report.pdf',
            'url' => '/media-file/uploads/initiative-edit-report.pdf',
            'uploadedById' => $editor->id,
        ]);
        Storage::disk('public')->put($pdf->storageKey, '%PDF-1.7');

        $this->actingAs($editor)
            ->get(route('admin.initiatives.edit', $initiative))
            ->assertOk()
            ->assertSee('id="experience-pdf-file"', false);

        $this->post(route('admin.experiences.media.pdf.store', $initiative), ['mediaId' => $pdf->id])
            ->assertRedirect(route('admin.initiatives.edit', $initiative));
        $this->get(route('admin.initiatives.edit', $initiative))
            ->assertOk()
            ->assertSee('initiative-edit-report.pdf');

        $this->delete(route('admin.experiences.media.pdf.destroy', [$initiative, $pdf]))
            ->assertRedirect(route('admin.initiatives.edit', $initiative));

        $this->assertDatabaseMissing('ExperienceMedia', ['experienceId' => $initiative->id, 'mediaId' => $pdf->id]);
        $this->assertDatabaseHas('Media', ['id' => $pdf->id]);
        Storage::disk('public')->assertExists($pdf->storageKey);
    }

    public function test_editor_can_remove_knowledge_pdf_attachment_without_deleting_media(): void
    {
        $editor = User::create([
            'name' => 'PDF Editor',
            'email' => 'pdf-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'pdf-removal-check',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create([
            'language' => Language::ID,
            'title' => 'PDF removal check',
        ]);
        $media = Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'research-report.pdf',
            'originalName' => 'research-report.pdf',
            'mimeType' => 'application/pdf',
            'size' => 128,
            'storageKey' => 'uploads/research-report.pdf',
            'url' => '/media-file/uploads/research-report.pdf',
            'uploadedById' => $editor->id,
        ]);
        $download = KnowledgeDownload::create([
            'knowledgeId' => $knowledge->id,
            'mediaId' => $media->id,
            'label' => 'Research report',
        ]);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('research-report.pdf')
            ->assertSee(route('admin.knowledge.downloads.destroy', [$knowledge, $download]), false);

        $this->delete(route('admin.knowledge.downloads.destroy', [$knowledge, $download]))
            ->assertRedirect(route('admin.knowledge.edit', $knowledge))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('KnowledgeDownload', ['id' => $download->id]);
        $this->assertDatabaseHas('Media', ['id' => $media->id]);
        $this->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('PDF berhasil dihapus.')
            ->assertDontSee('research-report.pdf');
        $audit = AuditLog::query()
            ->where('entity', 'Knowledge')
            ->where('entityId', $knowledge->id)
            ->firstOrFail();
        $this->assertSame(['action' => 'remove_pdf', 'downloadId' => $download->id], $audit->metadata);
    }

    public function test_editor_can_remove_knowledge_gallery_image_without_deleting_media(): void
    {
        $editor = User::create([
            'name' => 'Gallery Editor',
            'email' => 'gallery-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'gallery-removal-check',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create([
            'language' => Language::ID,
            'title' => 'Gallery removal check',
        ]);
        $media = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'field-photo.jpg',
            'originalName' => 'field-photo.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/field-photo.jpg',
            'url' => '/media-file/uploads/field-photo.jpg',
            'uploadedById' => $editor->id,
        ]);
        $knowledge->gallery()->attach($media->id, ['order' => 0]);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('field-photo.jpg')
            ->assertSee(route('admin.knowledge.gallery.destroy', [$knowledge, $media]), false);

        $this->delete(route('admin.knowledge.gallery.destroy', [$knowledge, $media]))
            ->assertRedirect(route('admin.knowledge.edit', $knowledge))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('KnowledgeMedia', ['knowledgeId' => $knowledge->id, 'mediaId' => $media->id]);
        $this->assertDatabaseHas('Media', ['id' => $media->id]);
        $this->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('Gambar berhasil dihapus dari galeri.')
            ->assertSee('field-photo.jpg')
            ->assertDontSee(route('admin.knowledge.gallery.destroy', [$knowledge, $media]), false);
        $audit = AuditLog::query()
            ->where('entity', 'Knowledge')
            ->where('entityId', $knowledge->id)
            ->firstOrFail();
        $this->assertSame(['action' => 'remove_image', 'mediaId' => $media->id], $audit->metadata);
    }

    public function test_editor_can_attach_existing_image_to_knowledge_gallery(): void
    {
        $editor = User::create([
            'name' => 'Gallery Attach Editor',
            'email' => 'gallery-attach-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'gallery-attach-check',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create([
            'language' => Language::ID,
            'title' => 'Gallery attach check',
        ]);
        $media = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'field-gallery.jpg',
            'originalName' => 'field-gallery.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 128,
            'storageKey' => 'uploads/field-gallery.jpg',
            'url' => '/media-file/uploads/field-gallery.jpg',
            'uploadedById' => $editor->id,
        ]);

        $this->actingAs($editor)
            ->post(route('admin.knowledge.gallery.store', $knowledge), ['mediaId' => $media->id])
            ->assertRedirect(route('admin.knowledge.edit', $knowledge))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('KnowledgeMedia', ['knowledgeId' => $knowledge->id, 'mediaId' => $media->id]);
        $this->assertDatabaseHas('Media', ['id' => $media->id]);
        $audit = AuditLog::query()
            ->where('entity', 'Knowledge')
            ->where('entityId', $knowledge->id)
            ->firstOrFail();
        $this->assertSame(['action' => 'attach_image', 'mediaId' => $media->id], $audit->metadata);
    }

    public function test_editor_can_upload_image_from_knowledge_gallery_and_attach_it(): void
    {
        Storage::fake('public');
        $editor = User::create([
            'name' => 'Gallery Upload Editor',
            'email' => 'gallery-upload-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'gallery-upload-check',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create(['language' => Language::ID, 'title' => 'Gallery upload check']);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('id="knowledge-gallery-file"', false);

        $upload = $this->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->image('gallery-upload.jpg', 640, 480),
        ])->assertOk()->assertJsonPath('data.type', MediaType::IMAGE->value);
        $mediaId = $upload->json('data.id');

        $this->post(route('admin.knowledge.gallery.store', $knowledge), ['mediaId' => $mediaId])
            ->assertRedirect(route('admin.knowledge.edit', $knowledge))
            ->assertSessionHas('success');

        $media = Media::findOrFail($mediaId);
        $this->assertDatabaseHas('KnowledgeMedia', ['knowledgeId' => $knowledge->id, 'mediaId' => $mediaId]);
        Storage::disk('public')->assertExists($media->storageKey);
    }

    public function test_editor_can_upload_pdf_and_attach_it_with_trimmed_label(): void
    {
        Storage::fake('public');
        $editor = User::create([
            'name' => 'PDF Flow Editor',
            'email' => 'pdf-flow-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'pdf-flow-check',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create(['language' => Language::ID, 'title' => 'PDF flow check']);

        $mediaResponse = $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('research-report.pdf', "%PDF-1.7\nResearch report"),
        ]);
        $mediaResponse->assertOk()->assertJsonPath('data.type', MediaType::DOCUMENT->value);
        $mediaId = $mediaResponse->json('data.id');

        $this->get(route('admin.knowledge.edit', $knowledge))
            ->assertOk()
            ->assertSee('id="knowledge-pdf-file"', false)
            ->assertSee('name="pdfLabel"', false);

        $updatePayload = [
            'slug' => $knowledge->slug,
            'type' => KnowledgeType::ARTICLE->value,
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'PDF flow check',
            'pdfMediaId' => $mediaId,
            'pdfLabel' => '  Report label  ',
        ];

        $this->put(route('admin.knowledge.update', $knowledge), $updatePayload)
            ->assertRedirect(route('admin.knowledge.edit', $knowledge))
            ->assertSessionHas('success');

        $download = KnowledgeDownload::query()->where('knowledgeId', $knowledge->id)->firstOrFail();
        $this->assertSame($mediaId, $download->mediaId);
        $this->assertSame('Report label', $download->label);
        $this->assertSame(MediaType::DOCUMENT, Media::findOrFail($mediaId)->type);
        Storage::disk('public')->assertExists(Media::findOrFail($mediaId)->storageKey);
        $attachAudit = AuditLog::query()
            ->where('entity', 'Knowledge')
            ->where('entityId', $knowledge->id)
            ->get()
            ->first(fn (AuditLog $log): bool => ($log->metadata['action'] ?? null) === 'attach_pdf');
        $this->assertNotNull($attachAudit);
        $this->assertSame(['action' => 'attach_pdf', 'mediaId' => $mediaId], $attachAudit->metadata);

        $this->put(route('admin.knowledge.update', $knowledge), $updatePayload)->assertRedirect(route('admin.knowledge.edit', $knowledge));
        $this->assertSame(2, KnowledgeDownload::query()->where('knowledgeId', $knowledge->id)->where('mediaId', $mediaId)->count());
    }

    public function test_editor_can_upload_pdf_while_creating_knowledge(): void
    {
        Storage::fake('public');
        $editor = User::create([
            'name' => 'PDF Create Editor',
            'email' => 'pdf-create-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($editor)
            ->get(route('admin.knowledge.create'))
            ->assertOk()
            ->assertSee('id="knowledge-pdf-file"', false)
            ->assertSee('name="pdfLabel"', false);

        $mediaResponse = $this->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('create-report.pdf', "%PDF-1.7\nCreate report"),
        ]);
        $mediaResponse->assertOk()->assertJsonPath('data.type', MediaType::DOCUMENT->value);
        $mediaId = $mediaResponse->json('data.id');

        $this->post(route('admin.knowledge.store'), [
            'slug' => 'created-with-pdf',
            'type' => KnowledgeType::ARTICLE->value,
            'status' => ContentStatus::DRAFT->value,
            'titleId' => 'Knowledge with PDF',
            'pdfMediaId' => $mediaId,
            'pdfLabel' => '  Supporting report  ',
        ])->assertRedirect(route('admin.knowledge.index'))
            ->assertSessionHas('success');

        $knowledge = Knowledge::where('slug', 'created-with-pdf')->firstOrFail();
        $download = KnowledgeDownload::query()->where('knowledgeId', $knowledge->id)->firstOrFail();
        $this->assertSame($mediaId, $download->mediaId);
        $this->assertSame('Supporting report', $download->label);
    }

    public function test_knowledge_rejects_non_pdf_attachments_and_invalid_pdf_uploads(): void
    {
        Storage::fake('public');
        $editor = User::create([
            'name' => 'PDF Validation Editor',
            'email' => 'pdf-validation-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'pdf-validation-check',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create(['language' => Language::ID, 'title' => 'PDF validation check']);
        $image = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'not-a-pdf.png',
            'originalName' => 'not-a-pdf.png',
            'mimeType' => 'image/png',
            'size' => 128,
            'storageKey' => 'uploads/not-a-pdf.png',
            'url' => '/media-file/uploads/not-a-pdf.png',
            'uploadedById' => $editor->id,
        ]);

        $this->actingAs($editor)->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('invalid.pdf', 'not a PDF'),
        ])->assertBadRequest()->assertJsonPath('success', false);

        $this->postJson(route('api.media.upload'), [
            'file' => UploadedFile::fake()->createWithContent('not-a-pdf.txt', 'not a PDF'),
        ])->assertBadRequest()->assertJsonPath('success', false);

        $this->from(route('admin.knowledge.edit', $knowledge))
            ->put(route('admin.knowledge.update', $knowledge), [
                'slug' => $knowledge->slug,
                'type' => KnowledgeType::ARTICLE->value,
                'titleId' => 'PDF validation check',
                'pdfMediaId' => $image->id,
                'pdfLabel' => 'Should be rejected',
            ])
            ->assertRedirect(route('admin.knowledge.edit', $knowledge))
            ->assertSessionHasErrors('pdfMediaId');

        $validPdf = Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'valid-report.pdf',
            'originalName' => 'valid-report.pdf',
            'mimeType' => 'application/pdf',
            'size' => 128,
            'storageKey' => 'uploads/valid-report.pdf',
            'url' => '/media-file/uploads/valid-report.pdf',
            'uploadedById' => $editor->id,
        ]);

        $this->from(route('admin.knowledge.edit', $knowledge))
            ->put(route('admin.knowledge.update', $knowledge), [
                'slug' => $knowledge->slug,
                'type' => KnowledgeType::ARTICLE->value,
                'titleId' => 'PDF validation check',
                'pdfMediaId' => $validPdf->id,
                'pdfLabel' => str_repeat('L', 192),
            ])
            ->assertRedirect(route('admin.knowledge.edit', $knowledge))
            ->assertSessionHasErrors('pdfLabel');

        $this->assertSame(0, KnowledgeDownload::where('knowledgeId', $knowledge->id)->count());
    }

    public function test_author_cannot_attach_pdf_to_knowledge(): void
    {
        $author = User::create([
            'name' => 'PDF Author',
            'email' => 'pdf-author@example.test',
            'role' => Role::AUTHOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $knowledge = Knowledge::create([
            'slug' => 'pdf-auth-check',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $author->id,
            'updatedById' => $author->id,
        ]);
        $knowledge->translations()->create(['language' => Language::ID, 'title' => 'PDF auth check']);
        $media = Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'authorized.pdf',
            'originalName' => 'authorized.pdf',
            'mimeType' => 'application/pdf',
            'size' => 128,
            'storageKey' => 'uploads/authorized.pdf',
            'url' => '/media-file/uploads/authorized.pdf',
            'uploadedById' => $author->id,
        ]);

        $this->actingAs($author)
            ->put(route('admin.knowledge.update', $knowledge), [
                'slug' => $knowledge->slug,
                'type' => KnowledgeType::ARTICLE->value,
                'titleId' => 'PDF auth check',
                'pdfMediaId' => $media->id,
                'pdfLabel' => 'Protected label',
            ])
            ->assertForbidden();

        $this->assertSame(0, KnowledgeDownload::where('knowledgeId', $knowledge->id)->count());
    }
}
