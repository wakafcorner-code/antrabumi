<?php

namespace App\Services\Media;

final class MediaStorageKeyResolver
{
    public function resolve(?string $storageKey): ?string
    {
        if ($storageKey === null || $storageKey === '' || preg_match('/[\x00-\x1F\x7F]/', $storageKey) === 1) {
            return null;
        }

        if (str_starts_with($storageKey, '/') || str_contains($storageKey, '\\') || str_contains($storageKey, ':')) {
            return null;
        }

        foreach (explode('/', $storageKey) as $segment) {
            if ($segment === '' || $segment === '.' || $segment === '..') {
                return null;
            }
        }

        return str_starts_with($storageKey, 'uploads/')
            ? $storageKey
            : 'uploads/'.$storageKey;
    }
}