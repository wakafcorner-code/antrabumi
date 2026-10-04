<?php

namespace App\Services\Media;

use App\Enums\MediaType;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class MediaStorageService
{
    public function __construct(private readonly MediaStorageKeyResolver $storageKeyResolver) {}

    public function store(UploadedFile $file, User $uploader, array $metadata = []): Media
    {
        $path = $file->store('uploads', 'public');
        if (! $path) {
            throw new \RuntimeException('Uploaded file could not be stored.');
        }

        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $type = $mimeType === 'application/pdf' ? MediaType::DOCUMENT : MediaType::IMAGE;
        $dimensions = $type === MediaType::IMAGE ? @getimagesize($file->getRealPath()) : false;
        $originalName = str_replace(['/', chr(92)], '_', $file->getClientOriginalName());
        $originalName = preg_replace('/[\x00-\x1F\x7F]/u', '', $originalName) ?? 'upload';
        $originalName = mb_substr(trim($originalName, " .\t\n\r\0\x0B") ?: 'upload', 0, 191);

        try {
            return DB::transaction(fn () => Media::create([
                'type' => $type,
                'filename' => basename($path),
                'originalName' => $originalName,
                'mimeType' => $mimeType,
                'size' => $file->getSize(),
                'width' => $dimensions[0] ?? null,
                'height' => $dimensions[1] ?? null,
                'storageKey' => $path,
                'url' => route('storage.media', ['path' => $path], false),
                'altText' => $metadata['altText'] ?? null,
                'caption' => $metadata['caption'] ?? null,
                'attribution' => $metadata['attribution'] ?? null,
                'uploadedById' => $uploader->id,
            ]));
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($path);
            throw $exception;
        }
    }

    public function delete(Media $media): void
    {
        $storageKey = $this->storageKeyResolver->resolve($media->storageKey);
        if ($storageKey === null) {
            $scheme = strtolower((string) parse_url($media->storageKey, PHP_URL_SCHEME));
            if ($media->storageKey === $media->url && filter_var($media->storageKey, FILTER_VALIDATE_URL) && in_array($scheme, ['http', 'https'], true)) {
                DB::transaction(function () use ($media): void {
                    $media->delete();
                });

                return;
            }

            throw new \InvalidArgumentException('Media storage key is invalid.');
        }

        DB::transaction(function () use ($media): void {
            $media->delete();
        });

        Storage::disk('public')->delete($storageKey);
    }
}
