<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Enums\Role;
use App\Enums\MediaType;
use App\Http\Controllers\Controller;
use App\Http\Requests\ExperienceRequest;
use App\Models\Experience;
use App\Models\Media;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class ExperienceController extends Controller
{
    protected string $resourceTitle = 'Pengalaman';

    public function create(): View
    {
        return view('admin.experiences.create', [
            'mediaItems' => Media::query()->latest('createdAt')->take(200)->get(),
        ]);
    }

    public function edit(Experience $experience): View
    {
        $experience->load(['translations', 'coverMedia', 'media']);

        return view('admin.experiences.edit', [
            'experience' => $experience,
            'translations' => $experience->translations->keyBy(fn ($translation) => $translation->language->value),
            'attachments' => $experience->media,
            'mediaItems' => Media::query()->latest('createdAt')->take(200)->get(),
        ]);
    }

    public function store(ExperienceRequest $request, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();
        $user = $request->user();
        $experience = DB::transaction(function () use ($data, $user): Experience {
            $experience = Experience::create([
                'slug' => $data['slug'],
                'type' => $data['type'] ?? 'EXPERIENCE',
                'status' => $data['status'] ?? ContentStatus::DRAFT,
                'publishedAt' => ($data['status'] ?? null) === ContentStatus::PUBLISHED->value ? now() : null,
                'year' => $data['year'] ?? null,
                'category' => $data['category'] ?? null,
                'clientName' => $data['client'] ?? $data['clientName'] ?? null,
                'location' => $data['location'] ?? null,
                'featured' => $data['featured'] ?? false,
                'coverMediaId' => $data['coverMediaId'] ?? null,
                'createdById' => $user->id,
                'updatedById' => $user->id,
            ]);

            $experience->translations()->create([
                'language' => Language::ID,
                'title' => $data['titleId'],
                'excerpt' => $data['excerptId'] ?? null,
                'description' => $data['bodyId'] ?? $data['descriptionId'] ?? null,
            ]);

            if (! empty($data['titleEn'])) {
                $experience->translations()->create([
                    'language' => Language::EN,
                    'title' => $data['titleEn'],
                    'excerpt' => $data['excerptEn'] ?? null,
                    'description' => $data['bodyEn'] ?? $data['descriptionEn'] ?? null,
                ]);
            }

            if (! empty($data['pdfMediaId'])) {
                $experience->media()->syncWithoutDetaching([$data['pdfMediaId'] => ['order' => 0]]);
            }

            return $experience;
        });

        $audit->record($user, AuditAction::CREATE, 'Experience', $experience->id, [
            'slug' => $experience->slug,
            'type' => $experience->type,
        ]);

        return redirect()->route('admin.experiences.edit', $experience)->with('status', 'Pengalaman berhasil dibuat.');
    }

    public function update(ExperienceRequest $request, Experience $experience, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();
        $user = $request->user();

        DB::transaction(function () use ($data, $experience, $user): void {
            $experience->update([
                'slug' => $data['slug'],
                'type' => $data['type'] ?? $experience->type,
                'status' => $data['status'] ?? $experience->status,
                'publishedAt' => ($data['status'] ?? null) === ContentStatus::PUBLISHED->value ? now() : $experience->publishedAt,
                'year' => $data['year'] ?? null,
                'category' => $data['category'] ?? null,
                'clientName' => $data['client'] ?? $data['clientName'] ?? null,
                'location' => $data['location'] ?? null,
                'featured' => $data['featured'] ?? false,
                'coverMediaId' => $data['coverMediaId'] ?? null,
                'updatedById' => $user->id,
            ]);

            $experience->translations()->updateOrCreate(
                ['language' => Language::ID],
                [
                    'title' => $data['titleId'],
                    'excerpt' => $data['excerptId'] ?? null,
                    'description' => $data['bodyId'] ?? $data['descriptionId'] ?? null,
                ]
            );

            if (array_key_exists('titleEn', $data)) {
                $experience->translations()->updateOrCreate(
                    ['language' => Language::EN],
                    [
                        'title' => $data['titleEn'] ?? '',
                        'excerpt' => $data['excerptEn'] ?? null,
                        'description' => $data['bodyEn'] ?? $data['descriptionEn'] ?? null,
                    ]
                );
            }

            if (! empty($data['pdfMediaId'])) {
                $experience->media()->syncWithoutDetaching([$data['pdfMediaId'] => ['order' => 0]]);
            }
        });

        $audit->record($user, AuditAction::UPDATE, 'Experience', $experience->id, ['slug' => $data['slug']]);

        return redirect()->route('admin.experiences.edit', $experience)->with('status', 'Perubahan berhasil disimpan.');
    }

    public function updateStatus(\Illuminate\Http\Request $request, Experience $experience, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate(['status' => ['required', \Illuminate\Validation\Rule::enum(ContentStatus::class)]]);
        $status = ContentStatus::from($validated['status']);
        $experience->update([
            'status' => $status,
            'publishedAt' => $status === ContentStatus::PUBLISHED ? now() : $experience->publishedAt,
            'updatedById' => $request->user()->id,
        ]);

        $action = match ($status) {
            ContentStatus::PUBLISHED => AuditAction::PUBLISH,
            ContentStatus::ARCHIVED => AuditAction::ARCHIVE,
            default => AuditAction::UPDATE,
        };
        $audit->record($request->user(), $action, 'Experience', $experience->id, ['status' => $status->value]);

        return redirect()->route('admin.experiences.edit', $experience)->with('status', 'Status berhasil diperbarui.');
    }

    public function storePdf(Request $request, Experience $experience, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'mediaId' => ['required', 'string', Rule::exists('Media', 'id')->where('type', MediaType::DOCUMENT->value)->where('mimeType', 'application/pdf')],
        ]);

        $experience->media()->syncWithoutDetaching([$validated['mediaId'] => ['order' => 0]]);
        $audit->record($request->user(), AuditAction::UPDATE, 'Experience', $experience->id, [
            'action' => 'attach_pdf',
            'mediaId' => $validated['mediaId'],
        ]);

        return $this->redirectToEditor($experience)->with('status', 'PDF berhasil dilampirkan.');
    }

    public function destroyPdf(Request $request, Experience $experience, Media $media, AuditLogService $audit): RedirectResponse
    {
        abort_unless($media->type === MediaType::DOCUMENT && $media->mimeType === 'application/pdf', 404);

        $experience->media()->detach($media->id);
        $audit->record($request->user(), AuditAction::UPDATE, 'Experience', $experience->id, [
            'action' => 'remove_pdf',
            'mediaId' => $media->id,
        ]);

        return $this->redirectToEditor($experience)->with('status', 'PDF berhasil dilepas.');
    }

    public function storeGalleryImage(Request $request, Experience $experience, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'mediaId' => ['required', 'string', Rule::exists('Media', 'id')->where('type', MediaType::IMAGE->value)],
        ]);

        $experience->media()->syncWithoutDetaching([$validated['mediaId'] => ['order' => 0]]);
        $audit->record($request->user(), AuditAction::UPDATE, 'Experience', $experience->id, [
            'action' => 'attach_image',
            'mediaId' => $validated['mediaId'],
        ]);

        return $this->redirectToEditor($experience)->with('status', 'Gambar berhasil ditambahkan ke galeri.');
    }

    public function destroyGalleryImage(Request $request, Experience $experience, Media $media, AuditLogService $audit): RedirectResponse
    {
        abort_unless($media->type === MediaType::IMAGE, 404);

        $experience->media()->detach($media->id);
        $audit->record($request->user(), AuditAction::UPDATE, 'Experience', $experience->id, [
            'action' => 'remove_image',
            'mediaId' => $media->id,
        ]);

        return $this->redirectToEditor($experience)->with('status', 'Gambar berhasil dilepas dari galeri.');
    }

    private function redirectToEditor(Experience $experience): RedirectResponse
    {
        $route = $experience->type === 'INITIATIVE' ? 'admin.initiatives.edit' : 'admin.experiences.edit';

        return redirect()->route($route, $experience);
    }

    public function destroy(Experience $experience, AuditLogService $audit): RedirectResponse
    {
        abort_unless(auth()->user()?->role?->value === Role::SUPER_ADMIN->value || auth()->user()?->role?->value === Role::ADMIN->value, 403);

        $id = $experience->id;
        $experience->delete();
        $audit->record(auth()->user(), AuditAction::DELETE, 'Experience', $id);

        return redirect()->route('admin.experiences.index')->with('status', 'Pengalaman berhasil dihapus.');
    }
}
