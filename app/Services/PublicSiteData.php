<?php

namespace App\Services;

use App\Enums\ContentStatus;
use App\Models\Experience;
use App\Models\Knowledge;
use App\Models\Partner;
use App\Models\Person;
use App\Models\SiteSetting;
use App\Services\Media\MediaUrlNormalizer;
use Illuminate\Support\Facades\Schema;

class PublicSiteData
{
    private ?array $settings = null;

    public function layoutSettings(): array
    {
        if ($this->settings === null) {
            if (! Schema::hasTable('SiteSetting')) {
                $this->settings = [];

                return $this->settings;
            }

            $this->settings = SiteSetting::query()
                ->orderBy('key')
                ->pluck('value', 'key')
                ->filter(static fn ($value): bool => $value !== null && $value !== '')
                ->all();
        }

        return $this->settings;
    }

    public function homepage(string $language): array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';
        $settings = $this->layoutSettings();
        $defaults = config('public_home.content');
        $storedContent = $this->decodeArray($settings['home_sections_content'] ?? null);

        $homeContent = $defaults;
        foreach (['whyUs', 'about', 'growth', 'framework', 'cta'] as $section) {
            if (isset($storedContent[$section]) && is_array($storedContent[$section])) {
                $homeContent[$section] = array_replace($defaults[$section], $storedContent[$section]);
            }
        }
        if (isset($storedContent['pillars']) && is_array($storedContent['pillars']) && $storedContent['pillars'] !== []) {
            $homeContent['pillars'] = $storedContent['pillars'];
        }
        if (! isset($storedContent['growth']['timeline']) || ! is_array($storedContent['growth']['timeline']) || $storedContent['growth']['timeline'] === []) {
            $homeContent['growth']['timeline'] = $defaults['growth']['timeline'];
        }
        if (! isset($storedContent['framework']['steps']) || ! is_array($storedContent['framework']['steps']) || $storedContent['framework']['steps'] === []) {
            $homeContent['framework']['steps'] = $defaults['framework']['steps'];
        }
        $mediaUrls = app(MediaUrlNormalizer::class);
        foreach (['whyUs.imageUrl', 'about.diagramUrl'] as $path) {
            data_set($homeContent, $path, $mediaUrls->normalize(data_get($homeContent, $path)));
        }
        $pillarImages = config('public_home.pillar_images');
        foreach ($homeContent['pillars'] as $pillar) {
            if (! is_array($pillar) || ! isset($pillar['key'], $pillar['imageUrl'])) {
                continue;
            }

            $imageUrl = $mediaUrls->normalize($pillar['imageUrl']);
            if (is_string($imageUrl) && $imageUrl !== '') {
                $pillarImages[$pillar['key']] = $imageUrl;
            }
        }

        $heroDefaults = config('public_home.hero');
        $heroSlides = $this->decodeArray($settings['home_hero_slides'] ?? null);
        if (is_array($heroSlides)) {
            foreach ($heroSlides as &$slide) {
                if (is_array($slide) && isset($slide['imageUrl'])) {
                    $slide['imageUrl'] = $mediaUrls->normalize($slide['imageUrl']);
                }
            }
            unset($slide);
        }
        $heroConfig = $this->decodeArray($settings['home_hero_slider_config'] ?? null);

        $experiences = Experience::query()
            ->where('status', ContentStatus::PUBLISHED->value)
            ->with(['translations', 'coverMedia', 'media'])
            ->orderByDesc('year')
            ->orderByDesc('createdAt')
            ->take(4)
            ->get()
            ->map(fn (Experience $experience): array => $this->experienceCard($experience))
            ->all();

        $latestKnowledge = Knowledge::query()
            ->where('status', ContentStatus::PUBLISHED->value)
            ->with(['coverMedia', 'translations'])
            ->orderByDesc('publishedAt')
            ->orderByDesc('createdAt')
            ->take(3)
            ->get()
            ->map(fn (Knowledge $knowledge): array => $this->knowledgeCard($knowledge))
            ->all();

        $partners = Partner::query()
            ->where('status', ContentStatus::PUBLISHED->value)
            ->with('logoMedia')
            ->orderBy('order')
            ->orderByDesc('createdAt')
            ->get()
            ->map(static fn (Partner $partner): array => [
                'id' => $partner->id,
                'name' => $partner->name,
                'slug' => $partner->slug,
                'category' => $partner->category,
                'description' => $partner->description,
                'website' => $partner->website,
                'logoUrl' => $partner->logoMedia?->url,
                'logoAlt' => $partner->logoMedia?->altText ?: $partner->name,
            ])
            ->all();

        return [
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'siteSettings' => $settings,
            'homeContent' => $homeContent,
            'heroSlides' => is_array($heroSlides) && $heroSlides !== [] ? $heroSlides : $heroDefaults['slides'],
            'heroConfig' => is_array($heroConfig) ? array_replace($heroDefaults['config'], $heroConfig) : $heroDefaults['config'],
            'contributions' => config('public_home.contributions.'.$language),
            'expertise' => config('public_home.expertise'),
            'pillarImages' => $pillarImages,
            'fallbackExperienceImages' => config('public_home.fallback_experience_images'),
            'experiences' => $experiences,
            'latestKnowledge' => $latestKnowledge,
            'partners' => $partners,
        ];
    }

    public function about(string $language): array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';

        $people = Person::query()
            ->where('status', ContentStatus::PUBLISHED->value)
            ->with(['translations', 'image', 'expertise'])
            ->orderBy('order')
            ->orderByDesc('createdAt')
            ->get()
            ->map(function (Person $person): array {
                $translation = $person->translations->first(fn ($item): bool => $item->language->value === 'ID')
                    ?? $person->translations->first();

                return [
                    'id' => $person->id,
                    'slug' => $person->slug,
                    'name' => $translation?->name ?? $person->slug,
                    'degree' => $translation?->degree,
                    'role' => $translation?->role,
                    'biography' => $translation?->biography,
                    'imageUrl' => $person->image?->url,
                    'imageAlt' => $person->image?->altText ?: $translation?->name,
                ];
            })
            ->all();

        return [
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'people' => $people,
            'story' => [
                'eyebrow' => $language === 'EN' ? 'ABOUT ANTRABUMI' : 'TENTANG ANTRABUMI',
                'title' => $language === 'EN' ? 'Connecting knowledge, nature, and communities.' : 'Menghubungkan pengetahuan, alam, dan komunitas.',
                'lead' => $language === 'EN'
                    ? 'ANTRABUMI works at the intersection of knowledge, nature, and communities. We bring together field experience, research, local knowledge, and different perspectives to understand issues more fully and develop contextual approaches.'
                    : 'ANTRABUMI bekerja di persimpangan pengetahuan, alam, dan komunitas. Kami menggabungkan pengalaman lapangan, riset, pengetahuan lokal, dan beragam perspektif untuk memahami persoalan secara lebih utuh serta mengembangkan pendekatan yang kontekstual.',
            ],
            'journey' => [
                ['year' => '2021', 'label' => $language === 'EN' ? 'Journey Begins' : 'Awal Perjalanan', 'description' => $language === 'EN' ? 'The first chapter of ANTRABUMI.' : 'Babak awal perjalanan ANTRABUMI.'],
                ['year' => '2022', 'label' => $language === 'EN' ? 'Identity Formed' : 'Membentuk Identitas', 'description' => $language === 'EN' ? 'A sharper framing and working identity.' : 'Bentuk identitas dan arah kerja yang lebih jelas.'],
                ['year' => '2023', 'label' => $language === 'EN' ? 'Learning from the Field' : 'Belajar dari Lapangan', 'description' => $language === 'EN' ? 'Grounded practice informed by lived realities.' : 'Pendekatan dibangun dari praktik nyata di lapangan.'],
                ['year' => '2024', 'label' => $language === 'EN' ? 'Strengthening Our Approach' : 'Memperkuat Pendekatan', 'description' => $language === 'EN' ? 'Refining methods and collaboration structures.' : 'Memperbaiki metodologi dan cara kolaborasi.'],
                ['year' => '2025', 'label' => $language === 'EN' ? 'Expanding Collaboration' : 'Memperluas Kolaborasi', 'description' => $language === 'EN' ? 'Working across more sectors and communities.' : 'Bekerja lintas sektor dan komunitas yang lebih luas.'],
                ['year' => '2026', 'label' => $language === 'EN' ? 'A New Chapter' : 'Bab Baru', 'description' => $language === 'EN' ? 'A fresh chapter shaped by learning and partnership.' : 'Bab baru yang dibangun dari pembelajaran dan kemitraan.'],
            ],
            'framework' => [
                ['step' => '01', 'title' => 'LISTEN', 'desc' => $language === 'EN' ? 'Understand context, voices, and local realities before acting.' : 'Memahami konteks, suara, dan realitas lokal sebelum bertindak.'],
                ['step' => '02', 'title' => 'CONNECT', 'desc' => $language === 'EN' ? 'Build relationships across communities, institutions, and sectors.' : 'Membina hubungan lintas komunitas, lembaga, dan sektor.'],
                ['step' => '03', 'title' => 'CO-CREATE', 'desc' => $language === 'EN' ? 'Develop shared direction with those affected by the issue.' : 'Menyusun arah bersama dengan mereka yang terdampak.'],
                ['step' => '04', 'title' => 'ACT', 'desc' => $language === 'EN' ? 'Translate understanding into practical and contextual action.' : 'Menerjemahkan pemahaman menjadi aksi yang praktis dan kontekstual.'],
                ['step' => '05', 'title' => 'LEARN', 'desc' => $language === 'EN' ? 'Reflect, adapt, and improve with evidence from field experience.' : 'Merefleksikan, menyesuaikan, dan meningkatkan dampak berdasarkan pembelajaran.'],
            ],
            'gedsi' => [
                'title' => $language === 'EN' ? 'GEDSI in practice' : 'GEDSI dalam praktik',
                'description' => $language === 'EN'
                    ? 'GEDSI is part of ANTRABUMI’s working approach. We consider different perspectives, access, needs, and community experience when designing solutions and supporting decision-making.'
                    : 'GEDSI adalah bagian dari pendekatan kerja ANTRABUMI. Kami mempertimbangkan berbagai perspektif, akses, kebutuhan, dan pengalaman komunitas saat merancang solusi serta mendukung pengambilan keputusan.',
            ],
        ];
    }

    public function collaboration(string $language): array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';

        $partners = Partner::query()
            ->where('status', ContentStatus::PUBLISHED->value)
            ->with('logoMedia')
            ->orderBy('order')
            ->orderByDesc('createdAt')
            ->get()
            ->map(static fn (Partner $partner): array => [
                'id' => $partner->id,
                'name' => $partner->name,
                'website' => $partner->website,
                'logoUrl' => $partner->logoMedia?->url,
                'logoAlt' => $partner->logoMedia?->altText ?: $partner->name,
            ])
            ->all();

        return [
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'audiences' => [
                ['title' => $language === 'EN' ? 'Communities' : 'Komunitas', 'description' => $language === 'EN' ? 'Local communities and grassroots organizations.' : 'Komunitas lokal dan organisasi berbasis masyarakat.'],
                ['title' => $language === 'EN' ? 'Governments' : 'Pemerintah', 'description' => $language === 'EN' ? 'Public institutions and local government planning.' : 'Institusi publik dan perencanaan pemerintah daerah.'],
                ['title' => $language === 'EN' ? 'Academics' : 'Akademisi', 'description' => $language === 'EN' ? 'Researchers, educators, and knowledge partners.' : 'Peneliti, pendidik, dan mitra pengetahuan.'],
                ['title' => $language === 'EN' ? 'Civil Society' : 'Masyarakat Sipil', 'description' => $language === 'EN' ? 'NGOs, networks, and community-led institutions.' : 'LSM, jaringan, dan lembaga yang digerakkan masyarakat.'],
                ['title' => $language === 'EN' ? 'Private Sector' : 'Sektor Swasta', 'description' => $language === 'EN' ? 'Businesses interested in grounded solutions.' : 'Pelaku usaha yang membutuhkan solusi yang konkret dan kontekstual.'],
                ['title' => $language === 'EN' ? 'Development Partners' : 'Mitra Pembangunan', 'description' => $language === 'EN' ? 'Funders and collaborative institutions working on systemic change.' : 'Pendana dan lembaga kolaboratif yang mendorong perubahan sistemik.'],
            ],
            'partners' => $partners,
            'cta' => [
                'title' => $language === 'EN' ? 'Start Collaboration' : 'Mulai Kolaborasi',
                'body' => $language === 'EN'
                    ? 'We collaborate with communities, government, academics, civil society, the private sector, and development partners.'
                    : 'Kami bekerja bersama komunitas, pemerintah, akademisi, masyarakat sipil, sektor swasta, dan mitra pembangunan.',
            ],
        ];
    }

    public function person(string $slug, string $language): ?array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';

        $person = Person::query()
            ->where('status', ContentStatus::PUBLISHED->value)
            ->where('slug', $slug)
            ->with(['translations', 'image', 'expertise'])
            ->first();

        if ($person === null) {
            return null;
        }

        $translation = $person->translations->first(fn ($item): bool => $item->language->value === $language)
            ?? $person->translations->first(fn ($item): bool => $item->language->value === 'ID')
            ?? $person->translations->first();

        return [
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'person' => [
                'id' => $person->id,
                'slug' => $person->slug,
                'name' => $translation?->name ?? $person->slug,
                'degree' => $translation?->degree,
                'role' => $translation?->role,
                'biography' => $translation?->biography,
                'imageUrl' => $person->image?->url,
                'imageAlt' => $person->image?->altText ?: $translation?->name,
            ],
        ];
    }

    private function decodeArray(?string $value): ?array
    {
        if ($value === null || $value === '') {
            return null;
        }

        $decoded = json_decode($value, true);

        return is_array($decoded) ? $decoded : null;
    }

    private function experienceCard(Experience $experience): array
    {
        $translations = $experience->translations;
        $gallery = $experience->media;
        $pdf = $gallery->first(static function ($media): bool {
            return $media->mimeType === 'application/pdf'
                || $media->type?->value === 'DOCUMENT'
                || str_ends_with(strtolower((string) $media->filename), '.pdf')
                || str_ends_with(strtolower((string) $media->url), '.pdf');
        });

        return [
            'id' => $experience->id,
            'slug' => $experience->slug,
            'type' => $experience->type,
            'status' => $experience->status->value,
            'year' => $experience->year,
            'category' => $experience->category,
            'clientName' => $experience->clientName,
            'location' => $experience->location,
            'featured' => $experience->featured,
            'titleId' => $translations->first(fn ($translation): bool => $translation->language->value === 'ID')?->title,
            'titleEn' => $translations->first(fn ($translation): bool => $translation->language->value === 'EN')?->title,
            'pdfUrl' => $pdf?->url,
            'pdfFilename' => $pdf?->originalName ?: $pdf?->filename,
            'coverMediaUrl' => $experience->coverMedia?->url,
            'coverMediaAlt' => $experience->coverMedia?->altText,
        ];
    }

    private function knowledgeCard(Knowledge $knowledge): array
    {
        return [
            'id' => $knowledge->id,
            'slug' => $knowledge->slug,
            'type' => $knowledge->type->value,
            'publishedAt' => $knowledge->publishedAt,
            'translations' => $knowledge->translations->map(static fn ($translation): array => [
                'language' => $translation->language->value,
                'title' => $translation->title,
                'excerpt' => $translation->excerpt,
            ])->all(),
            'coverMedia' => $knowledge->coverMedia ? [
                'url' => $knowledge->coverMedia->url,
                'altText' => $knowledge->coverMedia->altText,
            ] : null,
        ];
    }
}