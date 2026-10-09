<?php

namespace App\Services;

use App\Enums\ContentStatus;
use App\Models\Experience;
use App\Models\ExperienceTranslation;
use App\Models\Media;
use Throwable;

class PublicExperienceData
{
    public function __construct(private readonly PublicPageImages $pageImages) {}

    public function experienceListing(string $language): array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';

        try {
            $experiences = Experience::query()
                ->where('status', ContentStatus::PUBLISHED->value)
                ->where('type', 'EXPERIENCE')
                ->with(['coverMedia', 'translations', 'contributionAreas.translations'])
                ->orderByDesc('featured')
                ->orderByDesc('year')
                ->orderByDesc('createdAt')
                ->get();

            if ($experiences->isNotEmpty()) {
                return [
                    'experiences' => $experiences->map(fn (Experience $experience): array => $this->experienceListItem($experience, $language))->all(),
                    'language' => $language,
                    'isEnglish' => $language === 'EN',
                    'isFallback' => false,
                ];
            }
        } catch (Throwable) {
            // The source public page uses its source-supported list when a query fails.
        }

        $fallbackExperiences = config('public_experiences.listing_fallback');
        if ($language === 'EN') {
            foreach ($fallbackExperiences as &$item) {
                $detail = config('public_experiences.detail_fallback.'.$item['slug']);
                if ($detail) {
                    $item['title'] = $detail['titleEn'];
                    $item['excerpt'] = $detail['overviewEn'];
                    $item['category'] = $this->localizeCategory($detail['category'] ?? $item['category'], $language);
                }
            }
            unset($item);
        } else {
            foreach ($fallbackExperiences as &$item) {
                $item['category'] = $this->localizeCategory($item['category'] ?? null, $language);
            }
            unset($item);
        }

        return [
            'experiences' => $fallbackExperiences,
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'isFallback' => true,
        ];
    }

    public function initiativeListing(string $language, ?string $category = null, ?string $type = null): array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';
        $experiences = Experience::query()
            ->where('status', ContentStatus::PUBLISHED->value)
            ->with(['translations', 'coverMedia', 'media'])
            ->orderByDesc('year')
            ->orderByDesc('createdAt')
            ->take(40)
            ->get();

        $items = $experiences->values()->map(function (Experience $experience, int $index) use ($language): array {
            $translations = $experience->translations;
            $idTranslation = $translations->first(static fn (ExperienceTranslation $translation): bool => $translation->language->value === 'ID');
            $enTranslation = $translations->first(static fn (ExperienceTranslation $translation): bool => $translation->language->value === 'EN');
            $title = ($language === 'EN' ? $enTranslation?->title : $idTranslation?->title) ?: ($idTranslation?->title ?: $experience->slug);
            $rawCategory = strtolower((string) $experience->category);
            $isCampaign = str_contains($rawCategory, 'campaign') || str_contains($rawCategory, 'kampanye') || $index % 2 === 1;
            $pdf = $experience->media->first(fn (Media $media): bool => $this->isPdf($media));

            return [
                'id' => $experience->id,
                'slug' => $experience->slug,
                'title' => $title,
                'excerpt' => null,
                'year' => $experience->year,
                'category' => $this->localizeCategory(
                    $experience->category ?: ($isCampaign
                        ? ($language === 'EN' ? 'Campaign' : 'Kampanye')
                        : ($language === 'EN' ? 'Project' : 'Proyek')),
                    $language
                ),
                'categoryType' => $isCampaign ? 'CAMPAIGN' : 'PROJECT',
                'location' => $experience->location,
                'clientName' => $experience->clientName,
                'featured' => $experience->featured,
                'pdfUrl' => $pdf?->url,
                'pdfPreviewUrl' => $pdf?->url ? ExternalPdfReference::previewUrl($pdf->url) : null,
                'pdfLabel' => $pdf ? ($pdf->originalName ?: $title.' (Brief & Case Study)') : null,
            ];
        })->all();

        $queryCategory = strtolower($category ?: ($type ?? ''));
        $initialCategory = match ($queryCategory) {
            'campaign', 'kampanye', 'campaigne' => 'CAMPAIGN',
            'project', 'proyek' => 'PROJECT',
            default => 'ALL',
        };

        return [
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'items' => $items,
            'initialCategory' => $initialCategory,
            'initiativeAreas' => $this->initiativeAreas(),
            'contributions' => config('public_experiences.contributions'),
        ];
    }

    public function detail(string $requestedSlug, string $language, string $kind): ?array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';
        $aliases = config('public_experiences.slug_aliases');
        $slug = $aliases[$requestedSlug] ?? $requestedSlug;
        $experience = null;

        try {
            $experience = Experience::query()
                ->where('status', ContentStatus::PUBLISHED->value)
                ->whereIn('slug', array_values(array_unique([$slug, $requestedSlug])))
                ->with([
                    'coverMedia',
                    'translations',
                    'metrics',
                    'contributionAreas.translations',
                    'media',
                ])
                ->first();
        } catch (Throwable) {
            // The source detail pages have explicit fallbacks for their supported slugs.
        }

        if ($experience) {
            $slug = $experience->slug;
            $translationData = $experience->translations->map(static fn (ExperienceTranslation $translation): array => [
                'language' => $translation->language->value,
                'title' => $translation->title,
                'excerpt' => $translation->excerpt,
                'description' => $translation->description,
                'methodology' => $translation->methodology,
                'impact' => $translation->impact,
            ])->all();
            $metrics = $experience->metrics->map(static fn ($metric): array => [
                'label' => $metric->label,
                'value' => $metric->value,
                'unit' => $metric->unit,
                'order' => $metric->order,
            ])->all();
            $gallery = $experience->media->values();
            $categoryTranslations = $experience->contributionAreas->first()?->translations ?? collect();
            $location = $experience->location;
            $clientName = $experience->clientName;
            $cover = ['url' => $experience->coverMedia?->url, 'altText' => $experience->coverMedia?->altText];
            $year = $experience->year;
        } else {
            $fallbackSet = $kind === 'initiative' ? 'initiative_fallback' : 'detail_fallback';
            $fallback = config('public_experiences.'.$fallbackSet.'.'.$slug);
            if (! $fallback) {
                return null;
            }
            $translationData = [[
                'language' => 'ID', 'title' => $fallback['titleId'], 'excerpt' => $fallback['overviewId'],
                'description' => $fallback['overviewId'], 'methodology' => $fallback['methodologyId'] ?? null, 'impact' => $fallback['impactId'] ?? null,
            ], [
                'language' => 'EN', 'title' => $fallback['titleEn'], 'excerpt' => $fallback['overviewEn'],
                'description' => $fallback['overviewEn'], 'methodology' => $fallback['methodologyEn'] ?? null, 'impact' => $fallback['impactEn'] ?? null,
            ]];
            $metrics = [];
            $gallery = collect();
            $categoryTranslations = collect();
            $location = $fallback[$language === 'EN' ? 'locationEn' : 'locationId'] ?? null;
            $clientName = $fallback['partner'] ?? null;
            $cover = ['url' => null, 'altText' => null];
            $year = $fallback['year'];
        }

        $fallbackSet = $kind === 'initiative' ? 'initiative_fallback' : 'detail_fallback';
        $fallback = config('public_experiences.'.$fallbackSet.'.'.$slug);
        $languageTranslation = $this->translation($translationData, $language);
        $idTranslation = $this->translation($translationData, 'ID');
        $translation = $languageTranslation ?? $idTranslation ?? ($translationData[0] ?? null);
        $pdf = $gallery->first(fn (Media $media): bool => $this->isPdf($media));
        $galleryImages = $gallery
            ->filter(static fn (Media $media): bool => $media->type->value === 'IMAGE' && (bool) $media->url)
            ->map(static fn (Media $media): array => ['id' => $media->id, 'url' => $media->url, 'alt' => $media->originalName])
            ->values()
            ->all();
        $translatedCategory = $categoryTranslations->first(static fn ($item): bool => $item->language->value === $language)?->title
            ?? $categoryTranslations->first(static fn ($item): bool => $item->language->value === 'ID')?->title;
        $rawCategory = $experience?->category ?: ($fallback['category'] ?? null);
        $category = $this->localizeCategory(
            $translatedCategory ?: $rawCategory ?: ($language === 'EN'
                ? ($kind === 'initiative' ? 'Initiative' : 'Experience')
                : ($kind === 'initiative' ? 'Inisiatif' : 'Pengalaman')),
            $language
        );

        $otherExperiences = [];
        if ($kind === 'experience') {
            foreach (config('public_experiences.detail_fallback') as $otherSlug => $details) {
                if ($otherSlug === $slug || count($otherExperiences) >= 3) {
                    continue;
                }
                $otherExperiences[] = [
                    'slug' => $otherSlug,
                    'title' => $language === 'EN' ? $details['titleEn'] : $details['titleId'],
                    'category' => $this->localizeCategory($details['category'], $language),
                    'year' => $details['year'],
                    'excerpt' => $language === 'EN' ? $details['overviewEn'] : $details['overviewId'],
                ];
            }
        }

        $title = filled($languageTranslation['title'] ?? null)
            ? $languageTranslation['title']
            : ($idTranslation['title'] ?? $translation['title'] ?? $slug);
        $excerpt = filled($languageTranslation['excerpt'] ?? null)
            ? $languageTranslation['excerpt']
            : ($idTranslation['excerpt'] ?? $translation['excerpt'] ?? null);
        $methodology = filled($languageTranslation['methodology'] ?? null)
            ? $languageTranslation['methodology']
            : ($idTranslation['methodology'] ?? $translation['methodology'] ?? null);
        $impact = filled($languageTranslation['impact'] ?? null)
            ? $languageTranslation['impact']
            : ($idTranslation['impact'] ?? $translation['impact'] ?? null);
        $description = filled($languageTranslation['description'] ?? null)
            ? $languageTranslation['description']
            : ($idTranslation['description'] ?? null);
        $pageType = $language === 'EN'
            ? ($kind === 'initiative' ? 'Initiatives' : 'Experiences')
            : ($kind === 'initiative' ? 'Inisiatif' : 'Pengalaman');
        $metaTitle = $title.' — '.$pageType.' ANTRABUMI';
        $metaDescription = $excerpt ?: ($language === 'EN'
            ? ($kind === 'initiative' ? 'ANTRABUMI initiatives and field experiences.' : 'ANTRABUMI field experiences and initiatives.')
            : ($kind === 'initiative' ? 'Inisiatif dan pengalaman lapangan ANTRABUMI.' : 'Pengalaman dan inisiatif lapangan ANTRABUMI.'));

        return [
            'experience' => $experience,
            'slug' => $slug,
            'requestedSlug' => $requestedSlug,
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'kind' => $kind,
            'title' => $title,
            'excerpt' => $excerpt,
            'description' => $description,
            'methodology' => $methodology,
            'impact' => $impact,
            'year' => $year,
            'category' => $category,
            'location' => $location,
            'clientName' => $clientName,
            'cover' => $cover,
            'metrics' => $metrics,
            'galleryImages' => $galleryImages,
            'pdf' => $pdf ? [
                'url' => $pdf->url,
                'previewUrl' => ExternalPdfReference::previewUrl($pdf->url),
                'filename' => $pdf->filename,
                'originalName' => $pdf->originalName,
            ] : null,
            'otherExperiences' => $otherExperiences,
            'metaTitle' => $metaTitle,
            'metaDescription' => $metaDescription,
            'metaImage' => $cover['url'] ?? null,
        ];
    }

    private function experienceListItem(Experience $experience, string $language): array
    {
        $translations = $experience->translations;
        $translation = $translations->first(static fn (ExperienceTranslation $item): bool => $item->language->value === $language)
            ?? $translations->first(static fn (ExperienceTranslation $item): bool => $item->language->value === 'ID')
            ?? $translations->first();
        $areaTranslations = $experience->contributionAreas->first()?->translations ?? collect();
        $category = $areaTranslations->first(static fn ($item): bool => $item->language->value === $language)?->title
            ?? $areaTranslations->first(static fn ($item): bool => $item->language->value === 'ID')?->title
            ?? $areaTranslations->first()?->title;

        return [
            'id' => $experience->id,
            'slug' => $experience->slug,
            'year' => $experience->year ?? (int) now()->format('Y'),
            'featured' => $experience->featured,
            'clientName' => $experience->clientName,
            'location' => $experience->location,
            'category' => $category,
            'coverMedia' => $experience->coverMedia ? ['url' => $experience->coverMedia->url, 'altText' => $experience->coverMedia->altText] : null,
            'title' => $translation?->title ?? $experience->slug,
            'excerpt' => $translation?->excerpt,
        ];
    }

    private function translation(array $translations, string $language): ?array
    {
        foreach ($translations as $translation) {
            if ($translation['language'] === $language) {
                return $translation;
            }
        }

        return null;
    }

    private function isPdf(Media $media): bool
    {
        return $media->mimeType === 'application/pdf'
            || $media->type->value === 'DOCUMENT'
            || str_ends_with(strtolower($media->filename), '.pdf')
            || str_ends_with(strtolower((string) $media->url), '.pdf');
    }

    private function localizeCategory(?string $category, string $language): ?string
    {
        if ($category === null || $category === '') {
            return null;
        }

        $labels = [
            'Community Development' => ['ID' => 'Pengembangan Masyarakat', 'EN' => 'Community Development'],
            'Research & Assessment' => ['ID' => 'Riset & Asesmen', 'EN' => 'Research & Assessment'],
            'Research, Assessment & Knowledge' => ['ID' => 'Riset, Asesmen & Pengetahuan', 'EN' => 'Research, Assessment & Knowledge'],
            'Conservation, Climate & Sustainability' => ['ID' => 'Konservasi, Iklim & Keberlanjutan', 'EN' => 'Conservation, Climate & Sustainability'],
            'Konservasi & Lanskap' => ['ID' => 'Konservasi & Lanskap', 'EN' => 'Conservation & Landscape'],
            'Kelautan & Pesisir' => ['ID' => 'Kelautan & Pesisir', 'EN' => 'Marine & Coastal'],
            'Campaign' => ['ID' => 'Kampanye', 'EN' => 'Campaign'],
            'Kampanye' => ['ID' => 'Kampanye', 'EN' => 'Campaign'],
            'Project' => ['ID' => 'Proyek', 'EN' => 'Project'],
            'Proyek' => ['ID' => 'Proyek', 'EN' => 'Project'],
        ];

        return $labels[$category][$language] ?? $category;
    }

    private function initiativeAreas(): array
    {
        $areas = config('public_experiences.initiative_areas');
        $images = $this->pageImages->resolve(
            'initiative_area_images',
            collect($areas)->mapWithKeys(fn (array $area, int $index): array => [
                ['nature', 'community', 'research', 'climate'][$index] => $area['image'],
            ])->all(),
        );

        foreach ($areas as $index => &$area) {
            $key = ['nature', 'community', 'research', 'climate'][$index] ?? null;
            if ($key !== null) {
                $area['image'] = $images[$key] ?? $area['image'];
            }
        }
        unset($area);

        return $areas;
    }
}