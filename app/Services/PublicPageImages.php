<?php

namespace App\Services;

use App\Enums\MediaType;
use App\Models\Media;
use App\Models\SiteSetting;

class PublicPageImages
{
    public function resolve(string $settingKey, array $defaults): array
    {
        $value = SiteSetting::query()->where('key', $settingKey)->value('value');
        $savedIds = is_string($value) ? json_decode($value, true) : null;
        if (! is_array($savedIds)) {
            return $defaults;
        }

        $media = Media::query()
            ->whereIn('id', array_values(array_filter($savedIds, 'is_string')))
            ->where('type', MediaType::IMAGE->value)
            ->get()
            ->keyBy('id');

        foreach ($defaults as $key => $url) {
            $mediaId = $savedIds[$key] ?? null;
            if (is_string($mediaId) && $media->has($mediaId)) {
                $defaults[$key] = $media->get($mediaId)->url;
            }
        }

        return $defaults;
    }
}
