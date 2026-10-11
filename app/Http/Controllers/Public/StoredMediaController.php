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
        $isVideo = $media->mimeType === 'video/mp4' && $media->type === \App\Enums\MediaType::VIDEO;
        $range = $isVideo ? request()->header('Range') : null;
        $size = (int) $media->size;
        $start = 0;
        $end = max(0, $size - 1);
        $status = 200;
        $headers = [];

        if ($range !== null) {
            if (preg_match('/^bytes=(\d*)-(\d*)$/', trim($range), $matches) !== 1 || $size < 1) {
                fclose($stream);

                return response('', 416, ['Content-Range' => 'bytes */'.$size, 'Accept-Ranges' => 'bytes']);
            }

            if ($matches[1] === '') {
                $suffixLength = (int) $matches[2];
                if ($suffixLength < 1) {
                    fclose($stream);

                    return response('', 416, ['Content-Range' => 'bytes */'.$size, 'Accept-Ranges' => 'bytes']);
                }
                $start = max(0, $size - $suffixLength);
            } else {
                $start = (int) $matches[1];
                $end = $matches[2] === '' ? $size - 1 : min((int) $matches[2], $size - 1);
            }

            if ($start >= $size || $start > $end) {
                fclose($stream);

                return response('', 416, ['Content-Range' => 'bytes */'.$size, 'Accept-Ranges' => 'bytes']);
            }

            $status = 206;
            $headers['Content-Range'] = 'bytes '.$start.'-'.$end.'/'.$size;
            $headers['Content-Length'] = (string) ($end - $start + 1);
        }

        $inlineTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4'];
        $disposition = in_array($media->mimeType, $inlineTypes, true) ? 'inline' : 'attachment';
        $headers += [
            'Content-Type' => $media->mimeType,
            'Content-Length' => (string) ($status === 206 ? ($end - $start + 1) : $size),
            'Content-Disposition' => HeaderUtils::makeDisposition($disposition, $media->filename),
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'public, max-age=86400',
        ];
        if ($isVideo) {
            $headers['Accept-Ranges'] = 'bytes';
        }

        if ($media->mimeType === 'image/svg+xml') {
            $headers['Content-Security-Policy'] = 'sandbox';
        }

        return response()->stream(function () use ($stream, $start, $end, $status): void {
            if ($status === 206) {
                $remainingSkip = $start;
                while ($remainingSkip > 0 && ! feof($stream)) {
                    $skipped = fread($stream, min($remainingSkip, 1024 * 1024));
                    if ($skipped === false || $skipped === '') {
                        break;
                    }
                    $remainingSkip -= strlen($skipped);
                }

                $remainingBytes = $end - $start + 1;
                while ($remainingBytes > 0 && ! feof($stream)) {
                    $chunk = fread($stream, min($remainingBytes, 1024 * 1024));
                    if ($chunk === false || $chunk === '') {
                        break;
                    }
                    echo $chunk;
                    $remainingBytes -= strlen($chunk);
                }
            } else {
                fpassthru($stream);
            }
            fclose($stream);
        }, $status, $headers);
    }
}