<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Enums\ContentStatus;
use App\Enums\Language;
use App\Http\Controllers\Controller;
use App\Http\Requests\PersonRequest;
use App\Models\Person;
use App\Services\AuditLogService;
use App\Services\Media\MediaReferenceResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class PersonController extends Controller
{
    protected string $resourceTitle = 'Profil Tim';

    public function index(Request $request): View
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status');

        $people = Person::query()
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->when($search !== '', function ($query) use ($search): void {
                $query->whereHas('translations', fn ($translationQuery) => $translationQuery->where('name', 'like', '%'.$search.'%'))
                    ->orWhere('slug', 'like', '%'.$search.'%');
            })
            ->with(['translations', 'image'])
            ->orderBy('order')
            ->orderByDesc('createdAt')
            ->paginate(20)
            ->appends(['search' => $search, 'status' => $status]);

        return view('admin.people.index', compact('people', 'search', 'status'));
    }

    public function create(): View
    {
        return view('admin.people.create');
    }

    public function store(PersonRequest $request, MediaReferenceResolver $mediaReferences, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();
        $imageId = $mediaReferences->resolve(
            $data['imageId'] ?? null,
            $data['imageIdUrl'] ?? null,
            $request->user(),
            'image/jpeg'
        );

        $person = DB::transaction(function () use ($data, $imageId, $request): Person {
            $person = Person::create([
                'slug' => $data['slug'],
                'imageId' => $imageId,
                'status' => ContentStatus::DRAFT,
                'order' => $data['order'] ?? 0,
                'createdById' => $request->user()->id,
                'updatedById' => $request->user()->id,
            ]);

            $person->translations()->create([
                'language' => Language::ID,
                'name' => $data['nameId'],
                'degree' => $data['degreeId'] ?? null,
                'role' => $data['roleId'] ?? null,
                'biography' => $data['biographyId'] ?? null,
            ]);

            if (array_key_exists('nameEn', $data) && $data['nameEn'] !== null && $data['nameEn'] !== '') {
                $person->translations()->create([
                    'language' => Language::EN,
                    'name' => $data['nameEn'],
                    'degree' => $data['degreeEn'] ?? null,
                    'role' => $data['roleEn'] ?? null,
                    'biography' => $data['biographyEn'] ?? null,
                ]);
            }

            return $person;
        });

        $audit->record($request->user(), AuditAction::CREATE, 'Person', $person->id, ['slug' => $person->slug]);

        return redirect()->route('admin.people.index')->with('success', 'Profil tim berhasil dibuat.');
    }

    public function edit(Person $person): View
    {
        $person->load(['translations', 'image']);

        return view('admin.people.edit', compact('person'));
    }

    public function update(PersonRequest $request, Person $person, MediaReferenceResolver $mediaReferences, AuditLogService $audit): RedirectResponse
    {
        $data = $request->validated();
        $imageId = $mediaReferences->resolve(
            $data['imageId'] ?? null,
            $data['imageIdUrl'] ?? null,
            $request->user(),
            'image/jpeg'
        );

        DB::transaction(function () use ($data, $imageId, $person, $request): void {
            $person->update([
                'slug' => $data['slug'],
                'imageId' => $imageId ?? $person->imageId,
                'order' => $data['order'] ?? $person->order,
                'updatedById' => $request->user()->id,
            ]);

            $person->translations()->updateOrCreate(
                ['language' => Language::ID],
                [
                    'name' => $data['nameId'],
                    'degree' => $data['degreeId'] ?? null,
                    'role' => $data['roleId'] ?? null,
                    'biography' => $data['biographyId'] ?? null,
                ]
            );

            if (array_key_exists('nameEn', $data)) {
                $person->translations()->updateOrCreate(
                    ['language' => Language::EN],
                    [
                        'name' => $data['nameEn'] ?? '',
                        'degree' => $data['degreeEn'] ?? null,
                        'role' => $data['roleEn'] ?? null,
                        'biography' => $data['biographyEn'] ?? null,
                    ]
                );
            }
        });

        $audit->record($request->user(), AuditAction::UPDATE, 'Person', $person->id, ['slug' => $person->slug]);

        return redirect()->route('admin.people.index')->with('success', 'Profil tim berhasil diperbarui.');
    }

    public function destroy(Person $person, AuditLogService $audit): RedirectResponse
    {
        $id = $person->id;
        $person->delete();
        $audit->record(auth()->user(), AuditAction::DELETE, 'Person', $id, ['slug' => $person->slug]);

        return redirect()->route('admin.people.index')->with('success', 'Profil tim berhasil dihapus.');
    }

    public function updateStatus(Request $request, Person $person, AuditLogService $audit): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:DRAFT,REVIEW,PUBLISHED,ARCHIVED'],
        ]);

        $status = ContentStatus::from($validated['status']);
        $person->update(['status' => $status, 'updatedById' => $request->user()->id]);

        $action = match ($status) {
            ContentStatus::PUBLISHED => AuditAction::PUBLISH,
            ContentStatus::ARCHIVED => AuditAction::ARCHIVE,
            default => AuditAction::UPDATE,
        };

        $audit->record($request->user(), $action, 'Person', $person->id, ['status' => $status->value]);

        return redirect()->route('admin.people.edit', $person)->with('success', 'Status profil tim berhasil diperbarui.');
    }
}
