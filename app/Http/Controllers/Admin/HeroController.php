<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\HeroSettingsUpdateRequest;
use App\Models\SiteSetting;
use App\Services\AuditLogService;
use App\Services\Media\MediaUrlNormalizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class HeroController extends Controller
{
    public function index(MediaUrlNormalizer $mediaUrls): View
    {
        $slides = $this->settingArray('home_hero_slides', config('public_home.hero.slides', []));
        foreach ($slides as &$slide) {
            if (is_array($slide) && isset($slide['imageUrl'])) {
                $slide['imageUrl'] = $mediaUrls->normalize($slide['imageUrl']);
            }
        }
        unset($slide);
        $config = array_replace(
            config('public_home.hero.config', []),
            $this->settingArray('home_hero_slider_config', [])
        );

        return view('admin.hero.index', [
            'slides' => $slides,
            'config' => $config,
        ]);
    }

    public function update(HeroSettingsUpdateRequest $request, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validated();
        $slides = json_encode($validated['slides'], JSON_THROW_ON_ERROR);
        $config = json_encode($validated['config'], JSON_THROW_ON_ERROR);

        SiteSetting::query()->updateOrCreate(['key' => 'home_hero_slides'], ['value' => $slides]);
        SiteSetting::query()->updateOrCreate(['key' => 'home_hero_slider_config'], ['value' => $config]);
        $audit->record($request->user(), AuditAction::UPDATE, 'SiteSetting', 'home_hero_slider', [
            'slideCount' => count($validated['slides']),
            'autoplay' => $validated['config']['autoplay'],
            'intervalMs' => $validated['config']['intervalMs'],
        ]);

        return redirect()->route('admin.hero.index')->with('success', 'Pengaturan Hero Slider berhasil disimpan.');
    }

    private function settingArray(string $key, array $fallback): array
    {
        $value = SiteSetting::query()->where('key', $key)->value('value');
        if (! is_string($value) || $value === '') {
            return $fallback;
        }

        $decoded = json_decode($value, true);

        return is_array($decoded) ? $decoded : $fallback;
    }
}
