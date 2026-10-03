<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\MediaMetadataRequest;
use App\Http\Requests\MediaUploadRequest;
use App\Models\Media;
use App\Services\AuditLogService;
use App\Services\Media\MediaStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class MediaController extends Controller
{
    public function index(Request $request): View
    {
        $type = $request->query('type');
        $search = trim((string) $request->query('q', $request->query('search', '')));

        $media = Media::query()
            ->when($type !== null && $type !== '', fn ($query) => $query->where('type', $type))
            ->when($search !== '', fn ($query) => $query->where(function ($q) use ($search): void {
                $q->where('filename', 'like', '%'.$search.'%')
                    ->orWhere('originalName', 'like', '%'.$search.'%')
                    ->orWhere('altText', 'like', '%'.$search.'%');
            }))
            ->orderByDesc('createdAt')
            ->paginate(24)
            ->appends(['type' => $type, 'search' => $search]);

        return view('admin.media.index', compact('media', 'type', 'search'));
    }

    public function store(MediaUploadRequest $request, MediaStorageService $storage, AuditLogService $audit): JsonResponse
    {
        $media = $storage->store($request->file('file'), $request->user(), $request->validated());
        $audit->record($request->user(), AuditAction::UPLOAD, 'Media', $media->id, ['filename' => $media->filename, 'size' => (int) $media->size]);

        return response()->json(['success' => true, 'data' => [
            'id' => $media->id,
            'filename' => $media->filename,
            'url' => $media->url,
            'type' => $media->type->value,
            'size' => (int) $media->size,
            'altText' => $media->altText,
        ]]);
    }

    public function update(MediaMetadataRequest $request, Media $media, AuditLogService $audit): JsonResponse
    {
        $media->update($request->validated());
        $audit->record($request->user(), AuditAction::UPDATE, 'Media', $media->id);

        return response()->json(['success' => true, 'data' => $media->fresh()]);
    }

    public function destroy(Media $media, MediaStorageService $storage, AuditLogService $audit): JsonResponse
    {
        $id = $media->id;
        $storage->delete($media);
        $audit->record(request()->user(), AuditAction::DELETE, 'Media', $id);

        return response()->json(['success' => true]);
    }
}
