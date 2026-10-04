<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\HomeContentUpdateRequest;
use App\Models\SiteSetting;
use App\Services\AuditLogService;
use App\Services\Media\MediaUrlNormalizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class HomeContentController extends Controller
{
    public function index(MediaUrlNormalizer $mediaUrls): View
    {
        $value = SiteSetting::query()->where('key', 'home_sections_content')->value('value');
        $decoded = is_string($value) && $value !== '' ? json_decode($value, true) : null;
        $content = array_replace_recursive(config('public_home.content', []), is_array($decoded) ? $decoded : []);
        foreach (['pillars', 'growth.timeline', 'framework.steps'] as $path) {
            $items = is_array($decoded) ? data_get($decoded, $path) : null;
            if (is_array($items) && $items !== []) {
                data_set($content, $path, $items);
            }
        }
        foreach (['whyUs.imageUrl', 'about.diagramUrl'] as $path) {
            data_set($content, $path, $mediaUrls->normalize(data_get($content, $path)));
        }

        return view('admin.beranda.index', [
            'content' => $content,
        ]);
    }

    public function update(HomeContentUpdateRequest $request, AuditLogService $audit): RedirectResponse
    {
        $content = $request->validated('content');
        SiteSetting::query()->updateOrCreate([
            'key' => 'home_sections_content',
        ], [
            'value' => json_encode($content, JSON_THROW_ON_ERROR),
        ]);
        $audit->record($request->user(), AuditAction::UPDATE, 'SiteSetting', 'home_sections_content', [
            'updatedSections' => array_keys($content),
        ]);

        return redirect()->route('admin.home-content.index')->with('success', 'Konten beranda berhasil disimpan.');
    }
}
