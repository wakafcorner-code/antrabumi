<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\SettingsUpdateRequest;
use App\Models\SiteSetting;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SettingController extends Controller
{
    protected string $resourceTitle = 'Pengaturan';

    public function index(): View
    {
        $settings = SiteSetting::query()->orderBy('key')->get()->keyBy('key');

        return view('admin.settings.index', ['settings' => $settings]);
    }

    public function update(SettingsUpdateRequest $request, AuditLogService $audit): RedirectResponse
    {
        $payload = $request->validated();

        foreach ($payload as $key => $value) {
            if (! is_string($value)) {
                $value = (string) $value;
            }

            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        $audit->record($request->user(), AuditAction::SETTING_CHANGED, 'SiteSetting', 'bulk', ['keys' => array_keys($payload)]);

        return redirect()->route('admin.settings.index')->with('success', 'Pengaturan situs berhasil disimpan.');
    }
}
