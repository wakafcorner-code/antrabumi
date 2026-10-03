<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $category = trim((string) $request->query('category', ''));

        $query = Partner::query()
            ->where('status', ContentStatus::PUBLISHED)
            ->with(['logoMedia:id,url,altText']);

        if ($category !== '') {
            $query->where('category', $category);
        }

        $partners = $query
            ->orderBy('order')
            ->orderByDesc('createdAt')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $partners->map(fn (Partner $partner): array => [
                'id' => $partner->id,
                'name' => $partner->name,
                'slug' => $partner->slug,
                'description' => $partner->description,
                'category' => $partner->category,
                'website' => $partner->website,
                'order' => $partner->order,
                'logoMedia' => $partner->logoMedia ? [
                    'id' => $partner->logoMedia->id,
                    'url' => $partner->logoMedia->url,
                    'altText' => $partner->logoMedia->altText,
                ] : null,
            ])->values()->all(),
        ]);
    }
}
