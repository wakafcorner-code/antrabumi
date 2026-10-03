<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Enums\KnowledgeType;
use App\Enums\Language;
use App\Http\Controllers\Controller;
use App\Models\Knowledge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KnowledgeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query('page', 1));
        $limit = min(50, max(1, (int) $request->query('limit', 12)));
        $search = trim((string) $request->query('search', ''));
        $featured = $request->query('featured');
        $type = $request->query('type');
        $language = $this->normalizeLanguage($request->query('language', 'ID'));

        $query = Knowledge::query()
            ->where('status', ContentStatus::PUBLISHED)
            ->with(['coverMedia:id,url,altText', 'translations']);

        if ($type !== null && $type !== '') {
            $normalizedType = strtoupper((string) $type);
            if (enum_exists(KnowledgeType::class) && in_array($normalizedType, array_map(fn (KnowledgeType $item): string => $item->value, KnowledgeType::cases()), true)) {
                $query->where('type', $normalizedType);
            }
        }

        if ($featured !== null && $featured !== '') {
            $query->where('featured', filter_var($featured, FILTER_VALIDATE_BOOLEAN));
        }

        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('slug', 'like', "%{$search}%")
                    ->orWhere('authorName', 'like', "%{$search}%")
                    ->orWhereHas('translations', function ($translationQuery) use ($search): void {
                        $translationQuery->where('title', 'like', "%{$search}%");
                    });
            });
        }

        $total = $query->count();
        $items = $query
            ->orderByDesc('publishedAt')
            ->orderByDesc('createdAt')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $items->map(fn (Knowledge $knowledge): array => $this->mapKnowledge($knowledge, $language))->values()->all(),
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => (int) ceil($total / $limit),
            ],
        ]);
    }

    public function show(string $slug, Request $request): JsonResponse
    {
        $language = $this->normalizeLanguage($request->query('language', 'ID'));
        $knowledge = Knowledge::query()
            ->where('slug', $slug)
            ->where('status', ContentStatus::PUBLISHED)
            ->with(['coverMedia:id,url,altText', 'translations', 'downloads.media', 'categories', 'tags'])
            ->first();

        if (! $knowledge) {
            return response()->json([
                'success' => false,
                'error' => 'Knowledge item not found or not published',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->mapKnowledgeDetail($knowledge, $language),
        ]);
    }

    private function normalizeLanguage(?string $language): Language
    {
        $normalized = strtoupper((string) $language);

        return $normalized === 'EN' ? Language::EN : Language::ID;
    }

    private function mapKnowledge(Knowledge $knowledge, Language $language): array
    {
        $translation = $knowledge->translations
            ->first(fn ($item) => $item->language === $language)
            ?? $knowledge->translations->first();

        return [
            'id' => $knowledge->id,
            'slug' => $knowledge->slug,
            'type' => $knowledge->type?->value ?? $knowledge->type,
            'featured' => (bool) $knowledge->featured,
            'author' => $knowledge->authorName,
            'publishedAt' => $knowledge->publicationDate ?? $knowledge->publishedAt,
            'title' => $translation?->title ?? $knowledge->slug,
            'excerpt' => $translation?->excerpt ?? null,
            'coverMedia' => $knowledge->coverMedia ? [
                'id' => $knowledge->coverMedia->id,
                'url' => $knowledge->coverMedia->url,
                'altText' => $knowledge->coverMedia->altText,
            ] : null,
        ];
    }

    private function mapKnowledgeDetail(Knowledge $knowledge, Language $language): array
    {
        $translation = $knowledge->translations
            ->first(fn ($item) => $item->language === $language)
            ?? $knowledge->translations->first();

        return [
            'id' => $knowledge->id,
            'slug' => $knowledge->slug,
            'type' => $knowledge->type?->value ?? $knowledge->type,
            'featured' => (bool) $knowledge->featured,
            'author' => $knowledge->authorName,
            'publishedAt' => $knowledge->publicationDate ?? $knowledge->publishedAt,
            'title' => $translation?->title ?? $knowledge->slug,
            'excerpt' => $translation?->excerpt ?? null,
            'content' => $translation?->content ?? null,
            'seoTitle' => $translation?->seoTitle ?? null,
            'seoDescription' => $translation?->seoDescription ?? null,
            'coverMedia' => $knowledge->coverMedia ? [
                'id' => $knowledge->coverMedia->id,
                'url' => $knowledge->coverMedia->url,
                'altText' => $knowledge->coverMedia->altText,
            ] : null,
            'downloads' => $knowledge->downloads->map(fn ($download): array => [
                'id' => $download->media?->id,
                'url' => $download->media?->url,
                'originalName' => $download->media?->originalName,
                'filename' => $download->media?->filename,
            ])->values()->all(),
            'categories' => $knowledge->categories->map(fn ($category): array => [
                'id' => $category->id,
                'slug' => $category->slug,
                'name' => $category->name,
            ])->values()->all(),
            'tags' => $knowledge->tags->map(fn ($tag): array => [
                'id' => $tag->id,
                'slug' => $tag->slug,
                'name' => $tag->name,
            ])->values()->all(),
            'createdAt' => $knowledge->createdAt,
            'updatedAt' => $knowledge->updatedAt,
        ];
    }
}
