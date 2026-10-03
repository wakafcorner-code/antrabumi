<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Knowledge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('q', ''));
        $type = strtolower((string) $request->query('type', 'all'));
        $language = $this->normalizeLanguage($request->query('language', 'ID'));

        if ($query === '') {
            return response()->json([
                'success' => true,
                'query' => $query,
                'data' => [
                    'experiences' => [],
                    'knowledge' => [],
                ],
            ]);
        }

        $searchExperiences = in_array($type, ['all', 'experiences'], true);
        $searchKnowledge = in_array($type, ['all', 'knowledge'], true);

        $experiences = $searchExperiences
            ? Experience::query()
                ->where('status', ContentStatus::PUBLISHED)
                ->where(function ($builder) use ($query): void {
                    $builder
                        ->where('slug', 'like', "%{$query}%")
                        ->orWhere('clientName', 'like', "%{$query}%")
                        ->orWhere('location', 'like', "%{$query}%")
                        ->orWhereHas('translations', function ($translationQuery) use ($query): void {
                            $translationQuery
                                ->where('title', 'like', "%{$query}%")
                                ->orWhere('excerpt', 'like', "%{$query}%");
                        });
                })
                ->with([
                    'coverMedia:id,url,altText',
                    'translations' => fn ($translationQuery) => $translationQuery->select(['id', 'experienceId', 'language', 'title', 'excerpt']),
                ])
                ->take(10)
                ->get()
                ->map(fn (Experience $experience): array => $this->mapExperience($experience, $language))
                ->values()
            : [];

        $knowledge = $searchKnowledge
            ? Knowledge::query()
                ->where('status', ContentStatus::PUBLISHED)
                ->where(function ($builder) use ($query): void {
                    $builder
                        ->where('slug', 'like', "%{$query}%")
                        ->orWhere('authorName', 'like', "%{$query}%")
                        ->orWhereHas('translations', function ($translationQuery) use ($query): void {
                            $translationQuery
                                ->where('title', 'like', "%{$query}%")
                                ->orWhere('excerpt', 'like', "%{$query}%");
                        });
                })
                ->with([
                    'coverMedia:id,url,altText',
                    'translations' => fn ($translationQuery) => $translationQuery->select(['id', 'knowledgeId', 'language', 'title', 'excerpt']),
                ])
                ->take(10)
                ->get()
                ->map(fn (Knowledge $knowledgeItem): array => $this->mapKnowledge($knowledgeItem, $language))
                ->values()
            : [];

        return response()->json([
            'success' => true,
            'query' => $query,
            'data' => [
                'experiences' => $experiences,
                'knowledge' => $knowledge,
            ],
        ]);
    }

    private function normalizeLanguage(?string $language): Language
    {
        $normalized = strtoupper((string) $language);

        return $normalized === 'EN' ? Language::EN : Language::ID;
    }

    private function mapExperience(Experience $experience, Language $language): array
    {
        $translation = $experience->translations
            ->first(fn ($item) => $item->language === $language)
            ?? $experience->translations->first();

        return [
            'id' => $experience->id,
            'slug' => $experience->slug,
            'year' => $experience->year,
            'title' => $translation?->title ?? $experience->slug,
            'excerpt' => $translation?->excerpt,
            'coverMedia' => $experience->coverMedia ? [
                'url' => $experience->coverMedia->url,
                'altText' => $experience->coverMedia->altText,
            ] : null,
            'url' => "/inisiatif/{$experience->slug}",
        ];
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
            'title' => $translation?->title ?? $knowledge->slug,
            'excerpt' => $translation?->excerpt,
            'coverMedia' => $knowledge->coverMedia ? [
                'url' => $knowledge->coverMedia->url,
                'altText' => $knowledge->coverMedia->altText,
            ] : null,
            'url' => "/pengetahuan/{$knowledge->slug}",
        ];
    }
}
