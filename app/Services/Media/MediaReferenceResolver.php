<?php

namespace App\Services\Media;

use App\Enums\MediaType;
use App\Models\Media;
use App\Models\User;

class MediaReferenceResolver
{
    public function resolve(?string $mediaId, ?string $url, User $uploader, string $fallbackMimeType): ?string
    {
        if (filled($mediaId)) {
            return $mediaId;
        }

        if (! filled($url)) {
            return null;
        }

        $existingMedia = Media::query()->where('url', $url)->first();
        if ($existingMedia) {
            return $existingMedia->id;
        }

        $path = parse_url($url, PHP_URL_PATH);
        $filename = is_string($path) ? basename($path) : '';
        $filename = str_replace(['/', chr(92)], '_', $filename);
        $filename = preg_replace('/[\x00-\x1F\x7F]/u', '', $filename) ?? '';
        $filename = mb_substr(trim($filename, " .\t\n\r\0\x0B"), 0, 191);
        $filename = $filename !== '' ? $filename : ($fallbackMimeType === 'image/png' ? 'logo.png' : 'image.jpg');

        return Media::create([
            'type' => MediaType::IMAGE,
            'filename' => $filename,
            'originalName' => $filename,
            'mimeType' => $fallbackMimeType,
            'size' => 0,
            'storageKey' => $url,
            'url' => $url,
            'uploadedById' => $uploader->id,
        ])->id;
    }
}