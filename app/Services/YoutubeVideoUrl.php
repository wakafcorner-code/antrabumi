<?php

namespace App\Services;

class YoutubeVideoUrl
{
    public static function embedUrl(?string $url): ?string
    {
        if (! is_string($url) || trim($url) === '') {
            return null;
        }

        $parts = parse_url(trim($url));
        if (! is_array($parts) || strtolower($parts['scheme'] ?? '') !== 'https') {
            return null;
        }

        $host = strtolower($parts['host'] ?? '');
        $path = trim($parts['path'] ?? '', '/');
        $videoId = null;

        if (in_array($host, ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'], true)) {
            if ($path === 'watch') {
                parse_str($parts['query'] ?? '', $query);
                $videoId = $query['v'] ?? null;
            } elseif (preg_match('~^(?:embed|shorts)/([A-Za-z0-9_-]{11})$~', $path, $matches) === 1) {
                $videoId = $matches[1];
            }
        } elseif (in_array($host, ['youtu.be', 'www.youtu.be'], true) && preg_match('~^([A-Za-z0-9_-]{11})$~', $path, $matches) === 1) {
            $videoId = $matches[1];
        }

        return is_string($videoId) && preg_match('/^[A-Za-z0-9_-]{11}$/', $videoId) === 1
            ? 'https://www.youtube-nocookie.com/embed/'.$videoId
            : null;
    }
}
