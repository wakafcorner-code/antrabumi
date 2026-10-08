<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ExperienceRequest;
use App\Models\Experience;
use App\Models\Media;
use App\Services\AuditLogService;
use App\Services\ExternalPdfReference;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class InitiativeController extends Controller
{
    protected string $resourceTitle = 'Inisiatif';

    public function index(Request $request): View
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status');
        $type = $request->query('type', 'INITIATIVE');

        $initiatives = Experience::query()
            ->when($type !== null && $type !== '', fn ($query) => $query->where('type', $type))
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($subQuery) use ($search): void {
                    $subQuery->where('slug', 'like', '%'.$search.'%')
                        ->orWhere('clientName', 'like', '%'.$search.'%')
                        ->orWhere('location', 'like', '%'.$search.'%')
                        ->orWhereHas('translations', fn ($translationQuery) => $translationQuery->where('title', 'like', '%'.$search.'%'));
                });
            })
            ->with(['translations', 'coverMedia'])
            ->orderByDesc('createdAt')
            ->paginate(20)
            ->appends(['search' => $search, 'status' => $status, 'type' => $type]);

        return view('admin.initiatives.index', compact('initiatives', 'search', 'status', 'type'));
    }

    public function create(): View
    {
        return view('admin.initiatives.create', [
            'mediaItems' => Media::query()->where('type', \App\Enums\MediaType::IMAGE->value)->latest('createdAt')->take(200)->get(),
        ]);
    }

    public function store(ExperienceRequest $request, AuditLogService $audit, ExternalPdfReference $externalPdf): RedirectResponse
    {
        $data = $request->validated();
        $data['type'] ??= 'INITIATIVE';

        $initiative = DB::transaction(function () use ($data, $request, $externalPdf): Experience {
            $pdfMediaId = filled($data['pdfUrl'] ?? null)
                ? $externalPdf->resolve($data['pdfUrl'], $request->user())
                : ($data['pdfMediaId'] ?? null);

            $initiative = Experience::create([
                'slug' => $data['slug'],
                'type' => $data['type'],
                'status' => $data['status'] ?? ContentStatus::DRAFT,
                'publishedAt' => ($data['status'] ?? null) === ContentStatus::PUBLISHED->value ? now() : null,
                'year' => $data['year'] ?? null,
                'category' => $data['category'] ?? null,
                'clientName' => $data['client'] ?? $data['clientName'] ?? null,
                'location' => $data['location'] ?? null,
                'featured' => $data['featured'] ?? false,
                'coverMediaId' => $data['coverMediaId'] ?? null,
                'createdById' => $request->user()->id,
                'updatedById' => $request->user()->id,
            ]);

            $initiative->translations()->create([
                'language' => \App\Enums\Language::ID,
                'title' => $data['titleId'],
                'excerpt' => $data['excerptId'] ?? null,
                'description' => $data['bodyId'] ?? $data['descriptionId'] ?? null,
            ]);

            if (! empty($data['titleEn'])) {
                $initiative->translations()->create([
                    'language' => \App\Enums\Language::EN,
                    'title' => $data['titleEn'],
                    'excerpt' => $data['excerptEn'] ?? null,
                    'description' => $data['bodyEn'] ?? $data['descriptionEn'] ?? null,
                ]);
            }

            if (! empty($pdfMediaId)) {
                $initiative->media()->syncWithoutDetaching([$pdfMediaId => ['order' => 0]]);
            }
            if (! empty($data['galleryMediaIds'])) {
                $initiative->media()->syncWithoutDetaching(collect($data['galleryMediaIds'])->unique()->values()->mapWithKeys(
                    fn (string $mediaId, int $order): array => [$mediaId => ['order' => $order + 1]]
                )->all());
            }

            return $initiative;
        });

        $audit->record($request->user(), AuditAction::CREATE, 'Experience', $initiative->id, [
            'slug' => $initiative->slug,
            'type' => $initiative->type,
            'galleryImageCount' => count($data['galleryMediaIds'] ?? []),
        ]);

        return redirect()->route('admin.initiatives.edit', $initiative)->with('success', 'Inisiatif berhasil dibuat.');
    }

    public function edit(Experience $initiative): View
    {
        $initiative->load(['translations', 'coverMedia', 'media']);
        $mediaItems = Media::query()->where('type', \App\Enums\MediaType::IMAGE->value)->latest('createdAt')->take(200)->get();
        if ($initiative->coverMedia && ! $mediaItems->contains('id', $initiative->coverMedia->id)) {
            $mediaItems->prepend($initiative->coverMedia);
        }

        return view('admin.initiatives.edit', [
            'initiative' => $initiative,
            'translations' => $initiative->translations->keyBy(fn ($translation) => $translation->language->value),
            'mediaItems' => $mediaItems,
        ]);
    }

    public function update(ExperienceRequest $request, Experience $initiative, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();
        $data['type'] ??= $initiative->type;

        DB::transaction(function () use ($data, $initiative, $request): void {
            $initiative->update([
                'slug' => $data['slug'],
                'type' => $data['type'],
                'status' => $data['status'] ?? $initiative->status,
                'publishedAt' => ($data['status'] ?? null) === ContentStatus::PUBLISHED->value ? now() : $initiative->publishedAt,
                'year' => $data['year'] ?? null,
                'category' => $data['category'] ?? null,
                'clientName' => $data['client'] ?? $data['clientName'] ?? null,
                'location' => $data['location'] ?? null,
                'featured' => $data['featured'] ?? false,
                'coverMediaId' => $data['coverMediaId'] ?? null,
                'updatedById' => $request->user()->id,
            ]);

            $initiative->translations()->updateOrCreate(
                ['language' => \App\Enums\Language::ID],
                [
                    'title' => $data['titleId'],
                    'excerpt' => $data['excerptId'] ?? null,
                    'description' => $data['bodyId'] ?? $data['descriptionId'] ?? null,
                ]
            );

            if (array_key_exists('titleEn', $data)) {
                $initiative->translations()->updateOrCreate(
                    ['language' => \App\Enums\Language::EN],
                    [
                        'title' => $data['titleEn'] ?? '',
                        'excerpt' => $data['excerptEn'] ?? null,
                        'description' => $data['bodyEn'] ?? $data['descriptionEn'] ?? null,
                    ]
                );
            }
        });

        $audit->record($request->user(), AuditAction::UPDATE, 'Experience', $initiative->id, ['slug' => $initiative->slug]);

        return redirect()->route('admin.initiatives.edit', $initiative)->with('success', 'Inisiatif berhasil diperbarui.');
    }

    public function destroy(Experience $initiative, AuditLogService $audit): RedirectResponse
    {
        $id = $initiative->id;
        $initiative->delete();
        $audit->record(auth()->user(), AuditAction::DELETE, 'Experience', $id, ['slug' => $initiative->slug]);

        return redirect()->route('admin.initiatives.index')->with('success', 'Inisiatif berhasil dihapus.');
    }

    public function updateStatus(Request $request, Experience $initiative, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:DRAFT,REVIEW,PUBLISHED,ARCHIVED'],
        ]);

        $status = ContentStatus::from($validated['status']);
        $initiative->update([
            'status' => $status,
            'publishedAt' => $status === ContentStatus::PUBLISHED ? now() : $initiative->publishedAt,
            'updatedById' => $request->user()->id,
        ]);

        $action = match ($status) {
            ContentStatus::PUBLISHED => AuditAction::PUBLISH,
            ContentStatus::ARCHIVED => AuditAction::ARCHIVE,
            default => AuditAction::UPDATE,
        };

        $audit->record($request->user(), $action, 'Experience', $initiative->id, ['status' => $status->value]);

        return redirect()->route('admin.initiatives.edit', $initiative)->with('success', 'Status inisiatif berhasil diperbarui.');
    }
}
