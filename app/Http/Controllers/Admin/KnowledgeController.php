<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Enums\MediaType;
use App\Http\Controllers\Controller;
use App\Http\Requests\KnowledgeRequest;
use App\Models\Knowledge;
use App\Models\KnowledgeDownload;
use App\Models\Media;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class KnowledgeController extends Controller
{
    protected string $resourceTitle = 'Pengetahuan';

    public function index(Request $request): View
    {
        $search = trim((string) $request->query('q', $request->query('search', '')));
        $status = $request->query('status');
        $type = $request->query('type');

        $knowledge = Knowledge::query()
            ->when($type !== null && $type !== '', fn ($query) => $query->where('type', $type))
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->when($search !== '', function ($query) use ($search): void {
                $query->whereHas('translations', fn ($translationQuery) => $translationQuery->where('title', 'like', '%'.$search.'%'));
            })
            ->with(['translations', 'coverMedia'])
            ->orderByDesc('publishedAt')
            ->orderByDesc('createdAt')
            ->paginate(20)
            ->appends(['q' => $search, 'status' => $status, 'type' => $type]);

        return view('admin.knowledge.index', compact('knowledge', 'search', 'status', 'type'));
    }

    public function create(): View
    {
        return view('admin.knowledge.create', [
            'mediaItems' => Media::query()->latest('createdAt')->take(200)->get(),
        ]);
    }

    public function store(KnowledgeRequest $request, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();

        $knowledge = DB::transaction(function () use ($data, $request): Knowledge {
            $knowledge = Knowledge::create([
                'slug' => $data['slug'],
                'type' => $data['type'],
                'status' => $data['status'] ?? ContentStatus::DRAFT,
                'publishedAt' => ($data['status'] ?? null) === ContentStatus::PUBLISHED->value ? now() : null,
                'featured' => $data['featured'] ?? false,
                'authorName' => $data['authorName'] ?? null,
                'publicationDate' => $data['publicationDate'] ?? null,
                'coverMediaId' => $data['coverMediaId'] ?? null,
                'createdById' => $request->user()->id,
                'updatedById' => $request->user()->id,
            ]);

            $knowledge->translations()->create([
                'language' => Language::ID,
                'title' => $data['titleId'],
                'excerpt' => $data['excerptId'] ?? null,
                'content' => $data['contentId'] ?? null,
            ]);

            if (! empty($data['titleEn'])) {
                $knowledge->translations()->create([
                    'language' => Language::EN,
                    'title' => $data['titleEn'],
                    'excerpt' => $data['excerptEn'] ?? null,
                    'content' => $data['contentEn'] ?? null,
                ]);
            }

            if (! empty($data['pdfMediaId'])) {
                KnowledgeDownload::create([
                    'knowledgeId' => $knowledge->id,
                    'mediaId' => $data['pdfMediaId'],
                    'label' => filled($data['pdfLabel'] ?? null) ? trim($data['pdfLabel']) : null,
                    'order' => 0,
                ]);
            }
            if (! empty($data['galleryMediaIds'])) {
                $knowledge->gallery()->syncWithoutDetaching(collect($data['galleryMediaIds'])->unique()->values()->mapWithKeys(
                    fn (string $mediaId, int $order): array => [$mediaId => ['order' => $order]]
                )->all());
            }

            return $knowledge;
        });

        $audit->record($request->user(), AuditAction::CREATE, 'Knowledge', $knowledge->id, [
            'slug' => $knowledge->slug,
            'galleryImageCount' => count($data['galleryMediaIds'] ?? []),
        ]);

        return redirect()->route('admin.knowledge.index')->with('success', 'Pengetahuan berhasil dibuat.');
    }

    public function edit(Knowledge $knowledge): View
    {
        $knowledge->load(['translations', 'coverMedia', 'downloads.media', 'gallery']);
        $galleryMediaIds = $knowledge->gallery->modelKeys();

        return view('admin.knowledge.edit', [
            'knowledge' => $knowledge,
            'translations' => $knowledge->translations->keyBy(fn ($translation) => $translation->language->value),
            'mediaItems' => Media::query()
                ->where('type', MediaType::IMAGE->value)
                ->whereNotIn('id', $galleryMediaIds)
                ->latest('createdAt')
                ->take(200)
                ->get(),
        ]);
    }

    public function update(KnowledgeRequest $request, Knowledge $knowledge, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $knowledge, $request): void {
            $knowledge->update([
                'slug' => $data['slug'],
                'type' => $data['type'],
                'status' => $data['status'] ?? $knowledge->status,
                'publishedAt' => ($data['status'] ?? null) === ContentStatus::PUBLISHED->value ? now() : $knowledge->publishedAt,
                'featured' => $data['featured'] ?? false,
                'authorName' => $data['authorName'] ?? null,
                'publicationDate' => $data['publicationDate'] ?? null,
                'coverMediaId' => $data['coverMediaId'] ?? null,
                'updatedById' => $request->user()->id,
            ]);

            $knowledge->translations()->updateOrCreate(
                ['language' => Language::ID],
                [
                    'title' => $data['titleId'],
                    'excerpt' => $data['excerptId'] ?? null,
                    'content' => $data['contentId'] ?? null,
                ]
            );

            if (array_key_exists('titleEn', $data)) {
                $knowledge->translations()->updateOrCreate(
                    ['language' => Language::EN],
                    [
                        'title' => $data['titleEn'] ?? '',
                        'excerpt' => $data['excerptEn'] ?? null,
                        'content' => $data['contentEn'] ?? null,
                    ]
                );
            }

            if (! empty($data['pdfMediaId'])) {
                KnowledgeDownload::create([
                    'knowledgeId' => $knowledge->id,
                    'mediaId' => $data['pdfMediaId'],
                    'label' => filled($data['pdfLabel'] ?? null) ? trim($data['pdfLabel']) : null,
                    'order' => 0,
                ]);
            }
        });

        $audit->record($request->user(), AuditAction::UPDATE, 'Knowledge', $knowledge->id, ['slug' => $knowledge->slug]);
        if (! empty($data['pdfMediaId'])) {
            $audit->record($request->user(), AuditAction::UPDATE, 'Knowledge', $knowledge->id, [
                'action' => 'attach_pdf',
                'mediaId' => $data['pdfMediaId'],
            ]);
        }

        return redirect()->route('admin.knowledge.edit', $knowledge)->with('success', 'Pengetahuan berhasil diperbarui.');
    }

    public function destroyDownload(Request $request, Knowledge $knowledge, KnowledgeDownload $download, AuditLogService $audit): RedirectResponse
    {
        abort_unless($download->knowledgeId === $knowledge->id, 404);

        $downloadId = $download->id;
        $download->delete();
        $audit->record($request->user(), AuditAction::UPDATE, 'Knowledge', $knowledge->id, [
            'action' => 'remove_pdf',
            'downloadId' => $downloadId,
        ]);

        return redirect()->route('admin.knowledge.edit', $knowledge)->with('success', 'PDF berhasil dihapus.');
    }

    public function destroyGalleryImage(Request $request, Knowledge $knowledge, Media $media, AuditLogService $audit): RedirectResponse
    {
        $knowledge->gallery()->detach($media->id);
        $audit->record($request->user(), AuditAction::UPDATE, 'Knowledge', $knowledge->id, [
            'action' => 'remove_image',
            'mediaId' => $media->id,
        ]);

        return redirect()->route('admin.knowledge.edit', $knowledge)->with('success', 'Gambar berhasil dihapus dari galeri.');
    }

    public function storeGalleryImage(Request $request, Knowledge $knowledge, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'mediaId' => ['required', 'string', Rule::exists('Media', 'id')->where('type', MediaType::IMAGE->value)],
        ]);

        $mediaId = $validated['mediaId'];
        $knowledge->gallery()->syncWithoutDetaching([$mediaId => ['order' => 0]]);
        $audit->record($request->user(), AuditAction::UPDATE, 'Knowledge', $knowledge->id, [
            'action' => 'attach_image',
            'mediaId' => $mediaId,
        ]);

        return redirect()->route('admin.knowledge.edit', $knowledge)->with('success', 'Gambar berhasil ditambahkan ke galeri.');
    }

    public function destroy(Knowledge $knowledge, AuditLogService $audit): RedirectResponse
    {
        $id = $knowledge->id;
        $knowledge->delete();
        $audit->record(auth()->user(), AuditAction::DELETE, 'Knowledge', $id, ['slug' => $knowledge->slug]);

        return redirect()->route('admin.knowledge.index')->with('success', 'Pengetahuan berhasil dihapus.');
    }

    public function updateStatus(Request $request, Knowledge $knowledge, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:DRAFT,REVIEW,PUBLISHED,ARCHIVED'],
        ]);

        $status = ContentStatus::from($validated['status']);
        $knowledge->update([
            'status' => $status,
            'publishedAt' => $status === ContentStatus::PUBLISHED ? now() : $knowledge->publishedAt,
            'updatedById' => $request->user()->id,
        ]);

        $action = match ($status) {
            ContentStatus::PUBLISHED => AuditAction::PUBLISH,
            ContentStatus::ARCHIVED => AuditAction::ARCHIVE,
            default => AuditAction::UPDATE,
        };

        $audit->record($request->user(), $action, 'Knowledge', $knowledge->id, ['status' => $status->value]);

        return redirect()->route('admin.knowledge.edit', $knowledge)->with('success', 'Status pengetahuan berhasil diperbarui.');
    }
}
