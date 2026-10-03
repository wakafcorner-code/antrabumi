<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query('page', 1));
        $limit = min(50, max(1, (int) $request->query('limit', 12)));
        $search = trim((string) $request->query('search', ''));
        $year = $request->query('year');
        $featured = $request->query('featured');
        $language = $this->normalizeLanguage($request->query('language', 'ID'));

        $query = Experience::query()
            ->where('status', ContentStatus::PUBLISHED)
            ->with(['coverMedia:id,url,altText', 'translations']);

        if ($year !== null && $year !== '') {
            $parsedYear = (int) $year;
            if ($parsedYear > 0) {
                $query->where('year', $parsedYear);
            }
        }

        if ($featured !== null && $featured !== '') {
            $query->where('featured', filter_var($featured, FILTER_VALIDATE_BOOLEAN));
        }

        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('slug', 'like', "%{$search}%")
                    ->orWhere('clientName', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('translations', function ($translationQuery) use ($search): void {
                        $translationQuery->where('title', 'like', "%{$search}%");
                    });
            });
        }

        $total = $query->count();
        $items = $query
            ->orderByDesc('year')
            ->orderByDesc('createdAt')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $items->map(fn (Experience $experience): array => $this->mapExperience($experience, $language))->values()->all(),
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
        $experience = Experience::query()
            ->where('slug', $slug)
            ->where('status', ContentStatus::PUBLISHED)
            ->with(['coverMedia:id,url,altText', 'translations', 'metrics'])
            ->first();

        if (! $experience) {
            return response()->json([
                'success' => false,
                'error' => 'Experience not found or not published',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->mapExperienceDetail($experience, $language),
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
            'client' => $experience->clientName,
            'location' => $experience->location,
            'featured' => (bool) $experience->featured,
            'title' => $translation?->title ?? $experience->slug,
            'excerpt' => $translation?->excerpt ?? null,
            'description' => $translation?->description ?? null,
            'coverMedia' => $experience->coverMedia ? [
                'id' => $experience->coverMedia->id,
                'url' => $experience->coverMedia->url,
                'altText' => $experience->coverMedia->altText,
            ] : null,
        ];
    }

    private function mapExperienceDetail(Experience $experience, Language $language): array
    {
        $translation = $experience->translations
            ->first(fn ($item) => $item->language === $language)
            ?? $experience->translations->first();

        return [
            'id' => $experience->id,
            'slug' => $experience->slug,
            'year' => $experience->year,
            'client' => $experience->clientName,
            'location' => $experience->location,
            'featured' => (bool) $experience->featured,
            'title' => $translation?->title ?? $experience->slug,
            'excerpt' => $translation?->excerpt ?? null,
            'description' => $translation?->description ?? null,
            'methodology' => $translation?->methodology ?? null,
            'impact' => $translation?->impact ?? null,
            'coverMedia' => $experience->coverMedia ? [
                'id' => $experience->coverMedia->id,
                'url' => $experience->coverMedia->url,
                'altText' => $experience->coverMedia->altText,
            ] : null,
            'metrics' => $experience->metrics->map(fn ($metric): array => [
                'id' => $metric->id,
                'label' => $metric->label,
                'value' => $metric->value,
                'unit' => $metric->unit,
            ])->values()->all(),
            'createdAt' => $experience->createdAt,
            'updatedAt' => $experience->updatedAt,
        ];
    }
}
