<?php

namespace App\Services\Media;

use App\Models\Media;

class MediaUrlNormalizer
{
    public function normalize(?string $url): ?string
    {
        if (! filled($url)) {
            return $url;
        }

        return Media::query()->where('url', $url)->first()?->url ?? $url;
    }
}
