<?php

namespace App\Services;

use App\Enums\ContentStatus;
use App\Models\Knowledge;
use App\Models\KnowledgeTranslation;
use Illuminate\Support\Collection;

class PublicKnowledgeData
{
    public function __construct(
        private readonly RichTextSanitizer $sanitizer,
        private readonly PublicPageImages $pageImages,
    ) {}

    public function listing(string $language, ?string $category = null, ?string $type = null): array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';
        $items = Knowledge::query()
            ->where('status', ContentStatus::PUBLISHED->value)
            ->with(['coverMedia', 'translations', 'downloads.media'])
            ->orderByDesc('publishedAt')
            ->orderByDesc('createdAt')
            ->take(50)
            ->get()
            ->map(fn (Knowledge $knowledge): array => $this->listingItem($knowledge, $language))
            ->all();

        return [
            'items' => $items,
            'pageImages' => $this->pageImages->resolve('knowledge_page_images', [
                'field_story' => '/images/pengetahuan/cerita-lapangan.jpg',
                'assessment' => '/images/pengetahuan/laporan-assessment.jpg',
                'policy_brief' => '/images/pengetahuan/policy-brief.jpg',
                'toolkit' => '/images/pengetahuan/toolkit-community.jpg',
            ]),
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'initialType' => $this->initialType($category, $type),
        ];
    }

    public function detail(string $slug, string $language): ?array
    {
        $language = $language === 'EN' ? 'EN' : 'ID';
        $knowledge = Knowledge::query()
            ->where('slug', $slug)
            ->where('status', ContentStatus::PUBLISHED->value)
            ->with([
                'coverMedia',
                'translations',
                'downloads.media',
                'gallery',
            ])
            ->first();

        if (! $knowledge) {
            return null;
        }

        $translations = $knowledge->translations;
        $languageTranslation = $this->translationWithTitle($translations, $language);
        $idTranslation = $this->translationWithTitle($translations, 'ID');
        $firstTranslation = $translations->first();
        $displayTranslation = $languageTranslation ?? $idTranslation ?? $firstTranslation;
        $languageContent = $languageTranslation?->content;
        $content = $languageContent && $languageContent !== '<p></p>'
            ? $languageContent
            : ($idTranslation?->content ?? $displayTranslation?->content);
        $metadataTranslation = $this->translationWithTitle($translations, $language)
            ?? $this->translationWithTitle($translations, 'ID')
            ?? $firstTranslation;

        $downloads = $knowledge->downloads
            ->filter(static fn ($download): bool => (bool) $download->media?->url)
            ->map(static fn ($download): array => [
                'id' => $download->id,
                'label' => $download->label,
                'url' => $download->media->url,
                'previewUrl' => ExternalPdfReference::previewUrl($download->media->url),
                'filename' => $download->media->filename,
                'originalName' => $download->media->originalName,
            ])
            ->values();
        $gallery = $knowledge->gallery
            ->sortBy(static fn ($media): int => (int) ($media->pivot->order ?? 0))
            ->filter(static fn ($media): bool => (bool) $media->url)
            ->map(static fn ($media): array => [
                'id' => $media->id,
                'url' => $media->url,
                'alt' => $media->originalName,
            ])
            ->values();
        $cover = $knowledge->coverMedia?->url ? [
            'url' => $knowledge->coverMedia->url,
            'altText' => $knowledge->coverMedia->altText,
        ] : null;

        $typeLabels = $language === 'EN'
            ? ['ARTICLE' => 'Article', 'RESEARCH_PUBLICATION' => 'Research & Publication', 'STORY' => 'Field Story']
            : ['ARTICLE' => 'Artikel', 'RESEARCH_PUBLICATION' => 'Riset & Publikasi', 'STORY' => 'Cerita Lapangan'];
        $type = $knowledge->type->value;
        $date = $knowledge->publicationDate ?: $knowledge->publishedAt;

        return [
            'item' => $knowledge,
            'language' => $language,
            'isEnglish' => $language === 'EN',
            'title' => $displayTranslation?->title ?? $knowledge->slug,
            'excerpt' => $displayTranslation?->excerpt,
            'content' => $this->sanitizer->sanitize($content),
            'typeLabel' => $typeLabels[$type] ?? $type,
            'displayDate' => $date,
            'downloadable' => $downloads->first(),
            'downloads' => $downloads,
            'gallery' => $gallery,
            'cover' => $cover,
            'hasVisuals' => $cover !== null || $gallery->isNotEmpty(),
            'metaTitle' => $metadataTranslation?->title
                ? $metadataTranslation->title.' — Pengetahuan ANTRABUMI'
                : $knowledge->slug.' — ANTRABUMI',
            'metaDescription' => $metadataTranslation?->excerpt,
            'metaImage' => $knowledge->coverMedia?->url,
        ];
    }

    private function listingItem(Knowledge $knowledge, string $language): array
    {
        $translations = $knowledge->translations;
        $translation = $this->translationWithTitle($translations, $language)
            ?? $this->translationWithTitle($translations, 'ID')
            ?? $translations->first(fn (KnowledgeTranslation $item): bool => trim((string) $item->title) !== '')
            ?? $translations->first();
        $date = $knowledge->publishedAt ?: ($knowledge->publicationDate ?: $knowledge->createdAt);

        $downloads = $knowledge->downloads
            ->filter(static fn ($download): bool => (bool) $download->media?->url)
            ->map(static fn ($download): array => [
                'id' => $download->id,
                'label' => $download->label ?: ($download->media->originalName ?: $download->media->filename),
                'url' => $download->media->url,
                'previewUrl' => ExternalPdfReference::previewUrl($download->media->url),
                'filename' => $download->media->filename,
                'size' => (int) ($download->media->size ?? 0),
            ])
            ->values()
            ->all();

        return [
            'id' => $knowledge->id,
            'slug' => $knowledge->slug,
            'type' => $knowledge->type->value,
            'featured' => $knowledge->featured,
            'authorName' => $knowledge->authorName,
            'publishedAt' => $date,
            'coverMedia' => $knowledge->coverMedia ? [
                'url' => $knowledge->coverMedia->url,
                'altText' => $knowledge->coverMedia->altText,
            ] : null,
            'title' => trim((string) $translation?->title) ?: $knowledge->slug,
            'excerpt' => trim((string) $translation?->excerpt) ?: null,
            'downloads' => $downloads,
        ];
    }

    private function translationWithTitle(Collection $translations, string $language): ?KnowledgeTranslation
    {
        return $translations->first(static fn (KnowledgeTranslation $translation): bool =>
            $translation->language->value === $language && trim((string) $translation->title) !== ''
        );
    }

    private function initialType(?string $category, ?string $type): string
    {
        $value = strtolower(trim($category ?: ($type ?? '')));

        return match ($value) {
            'artikel', 'article' => 'ARTICLE',
            'riset', 'research', 'publikasi', 'research_publication' => 'RESEARCH_PUBLICATION',
            'cerita', 'story', 'lapangan' => 'STORY',
            default => 'ALL',
        };
    }
}