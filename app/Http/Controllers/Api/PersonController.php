<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PersonController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $language = $this->normalizeLanguage($request->query('language', 'ID'));

        $people = Person::query()
            ->where('status', ContentStatus::PUBLISHED)
            ->with(['image:id,url,altText', 'translations', 'expertise'])
            ->orderBy('order')
            ->orderBy('createdAt')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $people->map(fn (Person $person): array => $this->mapPerson($person, $language))->values()->all(),
        ]);
    }

    private function normalizeLanguage(?string $language): Language
    {
        $normalized = strtoupper((string) $language);

        return $normalized === 'EN' ? Language::EN : Language::ID;
    }

    private function mapPerson(Person $person, Language $language): array
    {
        $translation = $person->translations
            ->first(fn ($item) => $item->language === $language)
            ?? $person->translations->first();

        return [
            'id' => $person->id,
            'slug' => $person->slug,
            'order' => $person->order,
            'name' => $translation?->name ?? $person->slug,
            'role' => $translation?->role ?? null,
            'degree' => $translation?->degree ?? null,
            'biography' => $translation?->biography ?? null,
            'image' => $person->image ? [
                'id' => $person->image->id,
                'url' => $person->image->url,
                'altText' => $person->image->altText,
            ] : null,
            'expertise' => $person->expertise->map(fn ($expertise): array => [
                'id' => $expertise->id,
                'slug' => $expertise->slug,
                'name' => $expertise->name,
            ])->values()->all(),
        ];
    }
}
