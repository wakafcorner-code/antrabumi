<?php

namespace Database\Seeders;

use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Models\ContributionArea;
use App\Models\ContributionAreaTranslation;
use App\Models\Permission;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            'dashboard.view', 'pages.read', 'pages.write', 'experiences.read', 'experiences.write',
            'experiences.publish', 'people.read', 'people.write', 'knowledge.read', 'knowledge.write',
            'knowledge.publish', 'media.read', 'media.write', 'messages.read', 'messages.update',
            'users.manage', 'settings.manage', 'audit_logs.read',
        ] as $key) {
            Permission::firstOrCreate(['key' => $key]);
        }

        $areas = [
            ['conservation-climate-sustainability', 1, 'Conservation, Climate & Sustainability'],
            ['program-strategy', 2, 'Program & Strategy'],
            ['partnership-collaboration', 3, 'Partnership & Collaboration'],
            ['media-storytelling-campaign', 4, 'Media, Storytelling & Campaign'],
            ['community-development', 5, 'Community Development'],
            ['research-assessment-knowledge', 6, 'Research, Assessment & Knowledge'],
        ];

        foreach ($areas as [$slug, $order, $title]) {
            $area = ContributionArea::firstOrCreate(
                ['slug' => $slug],
                ['status' => ContentStatus::DRAFT, 'order' => $order],
            );

            foreach ([Language::ID, Language::EN] as $language) {
                ContributionAreaTranslation::firstOrCreate(
                    ['contributionAreaId' => $area->id, 'language' => $language],
                    ['title' => $title],
                );
            }
        }

        foreach ([
            'site.name' => 'Organization name',
            'site.tagline' => 'Organization tagline',
            'site.description' => 'Organization description',
            'site.email' => 'Contact email',
            'site.phone' => 'Contact phone',
            'site.address' => 'Organization address',
            'site.instagram' => 'Instagram handle',
            'site.linkedin' => 'LinkedIn URL',
            'site.website' => 'Organization website URL',
            'seo.defaultTitle' => 'Default SEO page title',
            'seo.defaultDescription' => 'Default SEO meta description',
            'seo.defaultOgImage' => 'Default OG image media ID',
        ] as $key => $description) {
            SiteSetting::firstOrCreate(['key' => $key], ['value' => null, 'description' => $description]);
        }

        if (env('SEED_ADMIN_EMAIL') && env('SEED_ADMIN_PASSWORD')) {
            $this->call(SuperAdminSeeder::class);
        }
    }
}
