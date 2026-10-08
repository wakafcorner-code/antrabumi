<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\ContributionArea;
use App\Models\ContributionAreaTranslation;
use App\Models\Experience;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicExperiencePagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_experience_listing_filters_type_status_and_preserves_featured_year_order(): void
    {
        $user = $this->editor();
        $area = ContributionArea::create(['slug' => 'research-area', 'status' => ContentStatus::PUBLISHED, 'order' => 0]);
        ContributionAreaTranslation::create(['contributionAreaId' => $area->id, 'language' => Language::ID, 'title' => 'Research & Assessment']);
        $olderFeatured = $this->experience($user, 'older-featured', 'EXPERIENCE', ContentStatus::PUBLISHED, 2023, true);
        $newerRegular = $this->experience($user, 'newer-regular', 'EXPERIENCE', ContentStatus::PUBLISHED, 2026, false);
        $initiative = $this->experience($user, 'published-initiative', 'INITIATIVE', ContentStatus::PUBLISHED, 2026, true);
        $this->experience($user, 'draft-experience', 'EXPERIENCE', ContentStatus::DRAFT, 2027, true);
        $olderFeatured->contributionAreas()->attach($area->id);
        $this->translation($olderFeatured, Language::ID, 'Older featured experience', 'Excerpt');
        $this->translation($newerRegular, Language::ID, 'Newer regular experience', 'Newer excerpt');
        $this->translation($initiative, Language::ID, 'Published initiative', 'Initiative excerpt');

        $this->get('/pengalaman')
            ->assertOk()
            ->assertSee('<title>Pengalaman — ANTRABUMI</title>', false)
            ->assertSee('data-experience-card data-year="2023"', false)
            ->assertSee('data-experience-card data-year="2026"', false)
            ->assertSee('Older featured experience')
            ->assertSee('Newer regular experience')
            ->assertDontSee('Published initiative')
            ->assertDontSee('draft-experience');
    }

    public function test_experience_listing_uses_source_supported_fallback_when_database_is_empty(): void
    {
        $this->get('/pengalaman')
            ->assertOk()
            ->assertSee('Indonesia Digital Ecosystem Assessment — IDEA')
            ->assertSee('Perencanaan Pengelolaan Ekowisata Desa')
            ->assertSee('Prototyping Pengelolaan Sampah Pasar Tradisional')
            ->assertSee('Pengalaman Terdokumentasi');
    }

    public function test_initiatives_include_all_published_experience_types_and_map_query_filter(): void
    {
        $user = $this->editor();
        $campaign = $this->experience($user, 'campaign-field', 'INITIATIVE', ContentStatus::PUBLISHED, 2026, false, 'Community Campaign');
        $project = $this->experience($user, 'project-field', 'EXPERIENCE', ContentStatus::PUBLISHED, 2025, false, 'Research & Assessment');
        $this->translation($campaign, Language::ID, 'Field Campaign', null);
        $this->translation($project, Language::ID, 'Field Project', null);

        $this->get('/inisiatif?type=campaign')
            ->assertOk()
            ->assertSee('data-initial-category="CAMPAIGN"', false)
            ->assertSee('data-initiative-card data-category="CAMPAIGN"', false)
            ->assertSee('Field Campaign')
            ->assertSee('Field Project');

        $this->get('/inisiatif?type=project')
            ->assertOk()
            ->assertSee('data-initial-category="PROJECT"', false);
    }

    public function test_initiative_empty_state_does_not_invent_records(): void
    {
        $this->get('/inisiatif')
            ->assertOk()
            ->assertSee('initiative-page', false)
            ->assertSee('EMPAT PILAR KERJA')
            ->assertSee('KONTRIBUSI KAMI')
            ->assertSee('Belum ada inisiatif yang terdaftar dalam kategori ini.')
            ->assertDontSee('data-initiative-card', false);
    }

    public function test_detail_aliases_metadata_metrics_and_legacy_media_urls_are_preserved(): void
    {
        $user = $this->editor();
        $experience = $this->experience($user, 'assessment-training-for-community-development', 'EXPERIENCE', ContentStatus::PUBLISHED, 2023, false);
        $this->translation($experience, Language::ID, 'Assessment Training for Community Development', 'Context-specific excerpt', "Context overview\n\nSecond paragraph", 'Assessment method', 'Learning impact');
        $this->translation($experience, Language::EN, 'Assessment Training EN', 'English excerpt', 'English overview', 'English method', 'English impact');
        $area = ContributionArea::create(['slug' => 'community-development', 'status' => ContentStatus::PUBLISHED, 'order' => 0]);
        ContributionAreaTranslation::create(['contributionAreaId' => $area->id, 'language' => Language::ID, 'title' => 'Community Development']);
        $experience->contributionAreas()->attach($area->id);
        $experience->metrics()->create(['label' => 'Trained', 'value' => '12', 'unit' => 'facilitators', 'order' => 1]);
        $cover = $this->media($user, 'cover.jpg', '/uploads/cover.jpg', MediaType::IMAGE, 'image/jpeg');
        $gallery = $this->media($user, 'gallery.jpg', '/uploads/gallery.jpg', MediaType::IMAGE, 'image/jpeg');
        $pdf = $this->media($user, 'brief.pdf', '/uploads/brief.pdf', MediaType::DOCUMENT, 'application/pdf');
        $experience->update(['coverMediaId' => $cover->id]);
        $experience->media()->attach($gallery->id, ['order' => 1]);
        $experience->media()->attach($pdf->id, ['order' => 0]);
        $this->assertSame(2, $experience->media()->count());
        $this->assertCount(2, $experience->fresh()->media);

        $this->disableCookieEncryption()->withCookie('antrabumi_lang', 'EN')->get('/experience/assessment-training-community-development')
            ->assertOk()
            ->assertSee('<title>Assessment Training EN — Pengalaman ANTRABUMI</title>', false)
            ->assertSee('English method')
            ->assertSee('English impact')
            ->assertSee('12')
            ->assertSee('/uploads/cover.jpg', false)
            ->assertSee('/uploads/brief.pdf', false)
            ->assertSee('Other Experiences');
    }

    public function test_known_source_fallback_detail_and_unknown_detail_status(): void
    {
        $this->get('/pengalaman/assessment-training-community-development')
            ->assertOk()
            ->assertSee('Assessment Training for Community Development')
            ->assertSee('Pendekatan & Metodologi');

        $this->get('/inisiatif/assessment-batik-ekologis')
            ->assertOk()
            ->assertSee('Assessment Pengembangan Batik Ekologis');

        $this->get('/pengalaman/not-a-known-source-slug')->assertNotFound();
        $this->get('/inisiatif/not-a-known-source-slug')->assertNotFound();
        $this->get('/experience/not-a-known-source-slug')->assertNotFound();
    }

    private function editor(): User
    {
        return User::create([
            'name' => 'Experience Editor',
            'email' => fake()->unique()->safeEmail(),
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
    }

    private function experience(User $user, string $slug, string $type, ContentStatus $status, int $year, bool $featured, ?string $category = null): Experience
    {
        return Experience::create([
            'slug' => $slug,
            'type' => $type,
            'status' => $status,
            'year' => $year,
            'featured' => $featured,
            'category' => $category,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
    }

    private function translation(Experience $experience, Language $language, string $title, ?string $excerpt = null, ?string $description = null, ?string $methodology = null, ?string $impact = null): void
    {
        $experience->translations()->create(compact('language', 'title', 'excerpt', 'description', 'methodology', 'impact'));
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