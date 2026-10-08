<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Enums\MediaType;
use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class PageImageController extends Controller
{
    private const INITIATIVE_IMAGES = [
        'nature' => ['label' => 'Konservasi Alam', 'default' => '/images/inisiatif/konservasi-alam.jpg'],
        'community' => ['label' => 'Pengembangan Masyarakat', 'default' => '/images/inisiatif/pengembangan-masyarakat.jpg'],
        'research' => ['label' => 'Riset & Pengetahuan', 'default' => '/images/inisiatif/riset-pengetahuan.jpg'],
        'climate' => ['label' => 'Iklim & Lanskap Berkelanjutan', 'default' => '/images/inisiatif/iklim-lanskap.jpg'],
    ];

    private const KNOWLEDGE_IMAGES = [
        'field_story' => ['label' => 'Cerita Lapangan Unggulan', 'default' => '/images/pengetahuan/cerita-lapangan.jpg'],
        'assessment' => ['label' => 'Laporan & Asesmen', 'default' => '/images/pengetahuan/laporan-assessment.jpg'],
        'policy_brief' => ['label' => 'Policy Brief', 'default' => '/images/pengetahuan/policy-brief.jpg'],
        'toolkit' => ['label' => 'Toolkit & Panduan', 'default' => '/images/pengetahuan/toolkit-community.jpg'],
    ];

    public function initiatives(): View
    {
        return $this->imageSettingsView(
            'Inisiatif',
            'Gambar area yang tampil di bagian Empat Pilar Kerja pada halaman Inisiatif.',
            'admin.initiatives.images.update',
            'admin.initiatives.index',
            'initiative_area_images',
            self::INITIATIVE_IMAGES,
        );
    }

    public function updateInitiatives(Request $request, AuditLogService $audit): RedirectResponse
    {
        return $this->save(
            $request,
            $audit,
            'initiative_area_images',
            self::INITIATIVE_IMAGES,
            'Foto area Inisiatif berhasil diperbarui.',
            'admin.initiatives.images',
        );
    }

    public function knowledge(): View
    {
        return $this->imageSettingsView(
            'Pengetahuan',
            'Gambar cerita unggulan dan kartu publikasi pada halaman Pengetahuan.',
            'admin.knowledge.images.update',
            'admin.knowledge.index',
            'knowledge_page_images',
            self::KNOWLEDGE_IMAGES,
        );
    }

    public function updateKnowledge(Request $request, AuditLogService $audit): RedirectResponse
    {
        return $this->save(
            $request,
            $audit,
            'knowledge_page_images',
            self::KNOWLEDGE_IMAGES,
            'Foto halaman Pengetahuan berhasil diperbarui.',
            'admin.knowledge.images',
        );
    }

    private function imageSettingsView(string $title, string $description, string $route, string $backRoute, string $settingKey, array $slots): View
    {
        $stored = $this->storedIds($settingKey);
        $media = Media::query()
            ->whereIn('id', array_values(array_filter($stored, 'is_string')))
            ->where('type', MediaType::IMAGE->value)
            ->get()
            ->keyBy('id');

        $images = [];
        foreach ($slots as $key => $slot) {
            $selected = $media->get($stored[$key] ?? '');
            $images[$key] = [
                ...$slot,
                'mediaId' => $selected?->id,
                'url' => $selected?->url ?: $slot['default'],
            ];
        }

        return view('admin.page-images.index', compact('title', 'description', 'route', 'backRoute', 'images'));
    }

    private function save(Request $request, AuditLogService $audit, string $settingKey, array $slots, string $message, string $redirectRoute): RedirectResponse
    {
        $rules = ['images' => ['required', 'array']];
        foreach (array_keys($slots) as $key) {
            $rules['images.'.$key] = [
                'nullable',
                'string',
                Rule::exists('Media', 'id')->where('type', MediaType::IMAGE->value),
            ];
        }

        $validated = $request->validate($rules);
        $imageIds = [];
        foreach (array_keys($slots) as $key) {
            $imageIds[$key] = $validated['images'][$key] ?? null;
        }

        SiteSetting::query()->updateOrCreate(
            ['key' => $settingKey],
            ['value' => json_encode($imageIds, JSON_THROW_ON_ERROR)],
        );
        $audit->record($request->user(), AuditAction::UPDATE, 'SiteSetting', $settingKey, [
            'updatedImages' => array_keys($slots),
        ]);

        return redirect()->route($redirectRoute)->with('success', $message);
    }

    private function storedIds(string $settingKey): array
    {
        $value = SiteSetting::query()->where('key', $settingKey)->value('value');
        $ids = is_string($value) ? json_decode($value, true) : null;

        return is_array($ids) ? $ids : [];
    }
}
