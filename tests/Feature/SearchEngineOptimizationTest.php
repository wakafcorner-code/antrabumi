<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Person;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchEngineOptimizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_render_social_metadata_and_organization_structured_data(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('<meta name="robots" content="index, follow, max-image-preview:large">', false)
            ->assertSee('<meta property="og:image" content="https://antrabumi.org/images/pengetahuan/cerita-lapangan.jpg">', false)
            ->assertSee('application/ld+json', false)
            ->assertSee('"@type":"Organization"', false)
            ->assertSee('"@type":"WebSite"', false);
    }

    public function test_sitemap_includes_published_team_profiles_but_excludes_drafts(): void
    {
        $editor = User::create([
            'name' => 'SEO Test Editor',
            'email' => 'seo-test-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        Person::create([
            'slug' => 'published-seo-profile',
            'status' => ContentStatus::PUBLISHED,
            'order' => 1,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        Person::create([
            'slug' => 'draft-seo-profile',
            'status' => ContentStatus::DRAFT,
            'order' => 2,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('<loc>https://antrabumi.org/tentang/tim/published-seo-profile</loc>', false)
            ->assertSee('<loc>https://antrabumi.org/pengalaman/'.array_key_first(config('public_experiences.detail_fallback')).'</loc>', false)
            ->assertDontSee('draft-seo-profile');
    }
}
