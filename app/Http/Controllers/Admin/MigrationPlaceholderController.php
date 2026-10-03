<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

abstract class MigrationPlaceholderController extends Controller
{
    protected string $resourceTitle = 'Konten';

    public function index(): View { return $this->pending('Daftar'); }
    public function create(): View { return $this->pending('Buat'); }
    public function show(string $id): View { return $this->pending('Detail', $id); }
    public function edit(string $id): View { return $this->pending('Edit', $id); }
    public function store(Request $request): never { abort(501, 'CRUD migration is pending.'); }
    public function update(Request $request, ?string $id = null): RedirectResponse
    {
        $keys = $this->settingKeyMap();

        if ($keys === []) {
            abort(501, 'CRUD migration is pending.');
        }

        foreach ($keys as $field => $settingKey) {
            $value = $request->input($field);

            if ($value === null) {
                continue;
            }

            SiteSetting::query()->updateOrCreate(
                ['key' => $settingKey],
                ['value' => is_string($value) ? $value : json_encode($value, JSON_THROW_ON_ERROR)]
            );
        }

        return redirect()->route($this->redirectRouteName())->with('success', 'Pengaturan berhasil disimpan.');
    }
    public function destroy(string $id): never { abort(501, 'CRUD migration is pending.'); }
    public function updateStatus(Request $request, ?string $id = null): never { abort(501, 'Workflow migration is pending.'); }
    public function updateRole(Request $request, ?string $id = null): never { abort(501, 'User-role migration is pending.'); }
    public function updatePassword(Request $request, ?string $id = null): never { abort(501, 'Password-management migration is pending.'); }

    protected function pending(string $action, ?string $id = null): View
    {
        return view('admin.migration-placeholder', [
            'resource' => $this->resourceTitle,
            'action' => $action,
            'recordId' => $id,
        ]);
    }

    protected function settingKeyMap(): array
    {
        return [];
    }

    protected function redirectRouteName(): string
    {
        return 'admin.'.Str::kebab(Str::replaceLast('Controller', '', class_basename(static::class))).'.index';
    }
}
