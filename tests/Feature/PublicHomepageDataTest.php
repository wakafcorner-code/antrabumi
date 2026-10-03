<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\KnowledgeType;
use App\Enums\Language;
use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\ContactMessage;
use App\Models\Experience;
use App\Models\ExperienceTranslation;
use App\Models\Knowledge;
use App\Models\KnowledgeTranslation;
use App\Models\Media;
use App\Models\Partner;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\PublicSiteData;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicHomepageDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_data_uses_published_content_and_source_sort_order(): void
    {
        $user = User::create([
            'name' => 'Test Editor',
            'email' => 'homepage-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $olderExperience = $this->experience($user, 'experience-older', 2024, ContentStatus::PUBLISHED);
        $newerExperience = $this->experience($user, 'experience-newer', 2025, ContentStatus::PUBLISHED);
        $this->experience($user, 'draft-experience', 2026, ContentStatus::DRAFT);
        $this->translation($olderExperience, 'Experience ID Older', 'Older English', Language::ID);
        $this->translation($olderExperience, 'Experience ID Older', 'Older English', Language::EN);
        $this->translation($newerExperience, 'Experience ID Newer', 'Newer English', Language::ID);
        $this->translation($newerExperience, 'Experience ID Newer', 'Newer English', Language::EN);

        $olderKnowledge = $this->knowledge($user, 'knowledge-older', '2025-01-01', ContentStatus::PUBLISHED);
        $newerKnowledge = $this->knowledge($user, 'knowledge-newer', '2025-03-01', ContentStatus::PUBLISHED);
        $this->knowledge($user, 'draft-knowledge', '2026-01-01', ContentStatus::DRAFT);
        $this->knowledgeTranslation($olderKnowledge, 'Older knowledge', Language::ID);
        $this->knowledgeTranslation($olderKnowledge, 'Older knowledge EN', Language::EN);
        $this->knowledgeTranslation($newerKnowledge, 'Newer knowledge', Language::ID);
        $this->knowledgeTranslation($newerKnowledge, 'Newer knowledge EN', Language::EN);

        Partner::create(['name' => 'Second Partner', 'slug' => 'second-partner', 'status' => ContentStatus::PUBLISHED, 'order' => 2]);
        Partner::create(['name' => 'First Partner', 'slug' => 'first-partner', 'status' => ContentStatus::PUBLISHED, 'order' => 1]);
        Partner::create(['name' => 'Draft Partner', 'slug' => 'draft-partner', 'status' => ContentStatus::DRAFT, 'order' => 0]);
        SiteSetting::create([
            'key' => 'home_sections_content',
            'value' => json_encode(['cta' => ['title' => 'Custom homepage CTA']], JSON_THROW_ON_ERROR),
        ]);

        $data = app(PublicSiteData::class)->homepage('EN');

        $this->assertTrue($data['isEnglish']);
        $this->assertSame('Custom homepage CTA', $data['homeContent']['cta']['title']);
        $this->assertSame('Connecting Knowledge, Nature, & Communities.', $data['heroSlides'][0]['title']);
        $this->assertSame(['experience-newer', 'experience-older'], array_column($data['experiences'], 'slug'));
        $this->assertSame('Newer English', $data['experiences'][0]['titleEn']);
        $this->assertSame(['knowledge-newer', 'knowledge-older'], array_column($data['latestKnowledge'], 'slug'));
        $englishTranslation = array_values(array_filter(
            $data['latestKnowledge'][0]['translations'],
            static fn (array $translation): bool => $translation['language'] === 'EN'
        ))[0];
        $this->assertSame('Newer knowledge EN', $englishTranslation['title']);
        $this->assertSame(['First Partner', 'Second Partner'], array_column($data['partners'], 'name'));
        $this->assertCount(6, $data['contributions']);
    }

    public function test_homepage_renders_public_content_metadata_and_unchanged_legacy_media_url(): void
    {
        $user = User::create([
            'name' => 'Test Editor',
            'email' => 'homepage-render-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $experience = $this->experience($user, 'homepage-public-experience', 2026, ContentStatus::PUBLISHED);
        $this->translation($experience, 'Published experience title', 'Published experience title EN', Language::ID);
        $this->translation($experience, 'Published experience title', 'Published experience title EN', Language::EN);
        $media = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'homepage-cover.jpg',
            'originalName' => 'homepage-cover.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 123,
            'storageKey' => 'homepage-cover.jpg',
            'url' => '/uploads/homepage-cover.jpg',
            'uploadedById' => $user->id,
        ]);
        $experience->update(['coverMediaId' => $media->id]);

        $knowledge = $this->knowledge($user, 'homepage-public-knowledge', '2026-02-01', ContentStatus::PUBLISHED);
        $this->knowledgeTranslation($knowledge, 'Published knowledge title', Language::ID);
        $this->knowledgeTranslation($knowledge, 'Published knowledge title EN', Language::EN);
        $this->knowledge($user, 'homepage-draft-knowledge', '2026-03-01', ContentStatus::DRAFT);
        Partner::create(['name' => 'Published partner', 'slug' => 'homepage-public-partner', 'status' => ContentStatus::PUBLISHED, 'order' => 1]);

        $this->get('/')
            ->assertOk()
            ->assertSee('<title>ANTRABUMI — Connecting Knowledge, Nature, &amp; Communities</title>', false)
            ->assertSee('Connecting Knowledge, Nature, & Communities.')
            ->assertSee('Published experience title')
            ->assertSee('Published knowledge title')
            ->assertSee('Published partner')
            ->assertSee('/uploads/homepage-cover.jpg', false)
            ->assertDontSee('@if', false)
            ->assertDontSee('@foreach', false)
            ->assertDontSee('homepage-draft-knowledge');
    }

    public function test_language_preference_updates_cookie_without_open_redirect(): void
    {
        $response = $this->from('/')->post(route('language.update'), [
            'language' => 'EN',
            'return_to' => '//outside.example/path',
        ]);

        $response->assertRedirect('/');
        $languageCookie = collect($response->headers->getCookies())
            ->first(static fn ($cookie): bool => $cookie->getName() === 'antrabumi_lang');

        $this->assertNotNull($languageCookie);
        $this->assertSame('EN', $languageCookie->getValue());
    }

    public function test_plain_next_language_cookie_selects_english_homepage(): void
    {
        $this->disableCookieEncryption()
            ->withCookie('antrabumi_lang', 'EN')
            ->get('/')
            ->assertOk()
            ->assertSee('WHY WE EXIST')
            ->assertSee('Contact Us');
    }

    public function test_about_page_renders_organization_story_and_people(): void
    {
        $user = User::create([
            'name' => 'Team Editor',
            'email' => 'about-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $person = \App\Models\Person::create([
            'slug' => 'sendi-kenia-savitri',
            'status' => ContentStatus::PUBLISHED,
            'order' => 1,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
        $person->translations()->create([
            'language' => \App\Enums\Language::ID,
            'name' => 'Sendi Kenia Savitri',
            'degree' => 'M.Si.',
            'role' => 'Research & Assessment',
            'biography' => 'Bekerja di bidang riset dan pengembangan.',
        ]);

        $this->withCookie('antrabumi_lang', 'ID')
            ->get('/tentang')
            ->assertOk()
            ->assertSee('ANTRABUMI')
            ->assertSee('Setiap kolaborasi dimulai')
            ->assertSee('Sendi Kenia Savitri');
    }

    public function test_collaboration_page_renders_audience_cta_and_partner_directory(): void
    {
        Partner::create(['name' => 'Published partner', 'slug' => 'published-partner', 'status' => ContentStatus::PUBLISHED, 'order' => 1]);

        $this->disableCookieEncryption()
            ->withCookie('antrabumi_lang', 'EN')
            ->get('/kolaborasi')
            ->assertOk()
            ->assertSee('Communities')
            ->assertSee('Governments')
            ->assertSee('Start Collaboration')
            ->assertSee('Published partner');
    }

    public function test_collaboration_form_persists_message_and_shows_success_banner(): void
    {
        $this->from('/kolaborasi')
            ->post(route('api.v1.contact.store'), [
                'name' => 'Test Collaborator',
                'email' => 'hello@example.test',
                'subject' => 'Partnership',
                'message' => 'We would like to discuss a community partnership.',
            ])
            ->assertRedirect(route('collaboration'))
            ->assertSessionHas('sent', true);

        $this->assertDatabaseHas('ContactMessage', [
            'email' => 'hello@example.test',
            'subject' => 'Partnership',
            'status' => 'NEW',
        ]);

        $this->get(route('collaboration'))
            ->assertOk()
            ->assertSee('Pesan berhasil dikirim.');
    }

    public function test_search_endpoint_returns_published_matches_for_experiences_and_knowledge(): void
    {
        $user = User::create([
            'name' => 'Search Editor',
            'email' => 'search-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $experience = $this->experience($user, 'climate-field-brief', 2025, ContentStatus::PUBLISHED);
        $experience->translations()->create([
            'language' => Language::ID,
            'title' => 'Catatan Lapangan Iklim',
            'excerpt' => 'Analisis tentang adaptasi komunitas.',
        ]);
        $experience->translations()->create([
            'language' => Language::EN,
            'title' => 'Climate Field Brief',
            'excerpt' => 'Assessment of community adaptation.',
        ]);

        $draftExperience = $this->experience($user, 'draft-search-result', 2024, ContentStatus::DRAFT);
        $draftExperience->translations()->create([
            'language' => Language::ID,
            'title' => 'Draft hasil pencarian',
        ]);

        $knowledge = $this->knowledge($user, 'community-led-insight', '2025-03-01', ContentStatus::PUBLISHED);
        $knowledge->translations()->create([
            'language' => Language::ID,
            'title' => 'Wawasan Pemberdayaan Komunitas',
            'excerpt' => 'Berdasarkan pengalaman lapangan.',
        ]);
        $knowledge->translations()->create([
            'language' => Language::EN,
            'title' => 'Community-Led Insight',
            'excerpt' => 'Based on field experience.',
        ]);

        $this->get(route('api.v1.search', ['q' => 'climate', 'type' => 'all', 'language' => 'EN']))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.experiences.0.slug', 'climate-field-brief')
            ->assertJsonPath('data.experiences.0.title', 'Climate Field Brief')
            ->assertJsonMissingPath('data.experiences.1')
            ->assertJsonPath('data.knowledge', []);

        $this->get(route('api.v1.search', ['q' => 'komunitas', 'type' => 'all', 'language' => 'ID']))
            ->assertOk()
            ->assertJsonPath('data.experiences.0.slug', 'climate-field-brief')
            ->assertJsonPath('data.knowledge.0.slug', 'community-led-insight');

        $this->get(route('api.v1.search', ['q' => 'draft', 'type' => 'all']))
            ->assertOk()
            ->assertJsonPath('data.experiences', [])
            ->assertJsonPath('data.knowledge', []);
    }

    public function test_public_api_routes_return_published_experience_knowledge_people_and_partners(): void
    {
        $user = User::create([
            'name' => 'API Editor',
            'email' => 'api-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        $experience = $this->experience($user, 'field-brief-2026', 2026, ContentStatus::PUBLISHED);
        $experience->translations()->create([
            'language' => Language::ID,
            'title' => 'Ringkasan Lapangan 2026',
            'excerpt' => 'Kerja sama komunitas dan riset.',
            'description' => 'Deskripsi lengkap.',
        ]);
        $experience->translations()->create([
            'language' => Language::EN,
            'title' => 'Field Brief 2026',
            'excerpt' => 'Community and research collaboration.',
            'description' => 'Full description.',
        ]);

        $knowledge = $this->knowledge($user, 'field-note-2026', '2026-06-01', ContentStatus::PUBLISHED);
        $knowledge->translations()->create([
            'language' => Language::ID,
            'title' => 'Catatan Lapangan 2026',
            'excerpt' => 'Integrasi pelajaran dan kolaborasi.',
            'content' => '<p>Konten</p>',
        ]);
        $knowledge->translations()->create([
            'language' => Language::EN,
            'title' => 'Field Note 2026',
            'excerpt' => 'Integrating lessons and collaboration.',
            'content' => '<p>Content</p>',
        ]);

        $media = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'person-headshot.jpg',
            'originalName' => 'person-headshot.jpg',
            'mimeType' => 'image/jpeg',
            'size' => 1024,
            'storageKey' => 'person-headshot.jpg',
            'url' => '/uploads/person-headshot.jpg',
            'uploadedById' => $user->id,
        ]);

        $person = \App\Models\Person::create([
            'slug' => 'api-person',
            'imageId' => $media->id,
            'status' => ContentStatus::PUBLISHED,
            'order' => 1,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
        $person->translations()->create([
            'language' => Language::ID,
            'name' => 'Orang API',
            'role' => 'Research & Assessment',
            'degree' => 'M.Si.',
            'biography' => 'Pengelola proses penelitian.',
        ]);
        $expertise = \App\Models\Expertise::create(['slug' => 'api-expertise', 'name' => 'Community Development']);
        $person->expertise()->attach($expertise->id, ['order' => 1]);

        $partner = Partner::create([
            'name' => 'API Partner',
            'slug' => 'api-partner',
            'description' => 'Partner testing API.',
            'website' => 'https://example.test',
            'category' => 'Research',
            'status' => ContentStatus::PUBLISHED,
            'order' => 1,
        ]);

        $this->get(route('api.v1.experiences.index', ['language' => 'EN', 'page' => 1, 'limit' => 10]))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.slug', 'field-brief-2026')
            ->assertJsonPath('data.0.title', 'Field Brief 2026');

        $this->get(route('api.v1.experiences.show', ['slug' => 'field-brief-2026', 'language' => 'EN']))
            ->assertOk()
            ->assertJsonPath('data.slug', 'field-brief-2026')
            ->assertJsonPath('data.title', 'Field Brief 2026');

        $this->get(route('api.v1.knowledge.index', ['language' => 'EN', 'page' => 1, 'limit' => 10]))
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'field-note-2026')
            ->assertJsonPath('data.0.title', 'Field Note 2026');

        $this->get(route('api.v1.knowledge.show', ['slug' => 'field-note-2026', 'language' => 'EN']))
            ->assertOk()
            ->assertJsonPath('data.slug', 'field-note-2026')
            ->assertJsonPath('data.title', 'Field Note 2026');

        $this->get(route('api.v1.people.index', ['language' => 'ID']))
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'api-person')
            ->assertJsonPath('data.0.name', 'Orang API');

        $this->get(route('api.v1.partners.index', ['category' => 'Research']))
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'api-partner')
            ->assertJsonPath('data.0.name', 'API Partner');
    }

    private function experience(User $user, string $slug, int $year, ContentStatus $status): Experience
    {
        return Experience::create([
            'slug' => $slug,
            'type' => 'EXPERIENCE',
            'year' => $year,
            'status' => $status,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
    }

    private function translation(Experience $experience, string $titleId, string $titleEn, Language $language): void
    {
        $experience->translations()->create([
            'language' => $language,
            'title' => $language === Language::EN ? $titleEn : $titleId,
        ]);
    }

    private function knowledge(User $user, string $slug, string $publishedAt, ContentStatus $status): Knowledge
    {
        return Knowledge::create([
            'slug' => $slug,
            'type' => KnowledgeType::ARTICLE,
            'status' => $status,
            'publishedAt' => $publishedAt,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
    }

    private function knowledgeTranslation(Knowledge $knowledge, string $title, Language $language): void
    {
        $knowledge->translations()->create(['language' => $language, 'title' => $title]);
    }
}