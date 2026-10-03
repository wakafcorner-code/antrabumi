<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use App\Services\AuditLogService;
use App\Services\Media\MediaReferenceResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class PartnerController extends Controller
{
    protected string $resourceTitle = 'Mitra';

    public function index(Request $request): View
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status');

        $partners = Partner::query()
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->when($search !== '', fn ($query) => $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('slug', 'like', '%'.$search.'%')
                    ->orWhere('category', 'like', '%'.$search.'%');
            }))
            ->orderBy('order')
            ->orderByDesc('createdAt')
            ->paginate(20)
            ->appends(['search' => $search, 'status' => $status]);

        return view('admin.partners.index', compact('partners', 'search', 'status'));
    }

    public function create(): View
    {
        return view('admin.partners.create');
    }

    public function store(PartnerRequest $request, MediaReferenceResolver $mediaReferences, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();
        $logoMediaId = $mediaReferences->resolve(
            $data['logoMediaId'] ?? null,
            $data['logoMediaIdUrl'] ?? null,
            $request->user(),
            'image/png'
        );
        $partner = Partner::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'logoMediaId' => $logoMediaId,
            'website' => $data['website'] ?? null,
            'category' => $data['category'] ?? null,
            'status' => ContentStatus::DRAFT,
            'order' => $data['order'] ?? 0,
        ]);

        $audit->record($request->user(), AuditAction::CREATE, 'Partner', $partner->id, ['slug' => $partner->slug]);

        return redirect()->route('admin.partners.edit', $partner)->with('success', 'Mitra berhasil dibuat.');
    }

    public function edit(Partner $partner): View
    {
        return view('admin.partners.edit', compact('partner'));
    }

    public function update(PartnerRequest $request, Partner $partner, MediaReferenceResolver $mediaReferences, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();
        $logoMediaId = $mediaReferences->resolve(
            $data['logoMediaId'] ?? null,
            $data['logoMediaIdUrl'] ?? null,
            $request->user(),
            'image/png'
        );

        DB::transaction(function () use ($data, $logoMediaId, $partner): void {
            $partner->update([
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? null,
                'logoMediaId' => $logoMediaId ?? $partner->logoMediaId,
                'website' => $data['website'] ?? null,
                'category' => $data['category'] ?? null,
                'order' => $data['order'] ?? $partner->order,
            ]);
        });

        $audit->record($request->user(), AuditAction::UPDATE, 'Partner', $partner->id, ['slug' => $partner->slug]);

        return redirect()->route('admin.partners.index')->with('success', 'Mitra berhasil diperbarui.');
    }

    public function destroy(Partner $partner, AuditLogService $audit): RedirectResponse
    {
        $audit->record(auth()->user(), AuditAction::DELETE, 'Partner', $partner->id, ['slug' => $partner->slug]);
        $partner->delete();

        return redirect()->route('admin.partners.index')->with('success', 'Mitra berhasil dihapus.');
    }

    public function updateStatus(Request $request, Partner $partner, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:DRAFT,REVIEW,PUBLISHED,ARCHIVED'],
        ]);

        $status = ContentStatus::from($validated['status']);
        $partner->update(['status' => $status]);

        $action = match ($status) {
            ContentStatus::PUBLISHED => AuditAction::PUBLISH,
            ContentStatus::ARCHIVED => AuditAction::ARCHIVE,
            default => AuditAction::UPDATE,
        };

        $audit->record($request->user(), $action, 'Partner', $partner->id, ['status' => $status->value]);

        return redirect()->route('admin.partners.edit', $partner)->with('success', 'Status mitra berhasil diperbarui.');
    }
}
