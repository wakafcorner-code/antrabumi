<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\HomeContentUpdateRequest;
use App\Models\SiteSetting;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class HomeContentController extends Controller
{
    public function index(): View
    {
        $value = SiteSetting::query()->where('key', 'home_sections_content')->value('value');
        $decoded = is_string($value) && $value !== '' ? json_decode($value, true) : null;
        $content = is_array($decoded) ? $decoded : config('public_home.content', []);

        return view('admin.beranda.index', [
            'contentJson' => json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
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
