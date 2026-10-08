<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\Media\MediaStorageKeyResolver;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StoredMediaController extends Controller
{
    public function show(string $path, MediaStorageKeyResolver $resolver): StreamedResponse
    {
        abort_unless($resolver->resolve($path) !== null, 404);

        $media = Media::query()->where('storageKey', $path)->firstOrFail();

        return $this->stream($media, $resolver);
    }

    public function showLegacy(string $path, MediaStorageKeyResolver $resolver): StreamedResponse
    {
        $resolvedKey = $resolver->resolve($path);
        abort_unless($resolvedKey !== null, 404);

        $media = Media::query()
            ->whereIn('storageKey', array_values(array_unique([$path, $resolvedKey])))
            ->firstOrFail();

        return $this->stream($media, $resolver);
    }

    private function stream(Media $media, MediaStorageKeyResolver $resolver): StreamedResponse
    {
        $storageKey = $resolver->resolve($media->storageKey);
        abort_unless($storageKey !== null, 404);

        $disk = Storage::disk('public');
        abort_unless($disk->exists($storageKey), 404);

        $stream = $disk->readStream($storageKey);
        abort_unless(is_resource($stream), 404);
        $inlineTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
        $disposition = in_array($media->mimeType, $inlineTypes, true) ? 'inline' : 'attachment';
        $headers = [
            'Content-Type' => $media->mimeType,
            'Content-Length' => (string) $media->size,
            'Content-Disposition' => HeaderUtils::makeDisposition($disposition, $media->filename),
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'public, max-age=86400',
        ];

        if ($media->mimeType === 'image/svg+xml') {
            $headers['Content-Security-Policy'] = 'sandbox';
        }

        return response()->stream(function () use ($stream): void {
            fpassthru($stream);
            fclose($stream);
        }, 200, $headers);
    }
}