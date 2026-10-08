<?php

namespace App\Services;

use App\Enums\MediaType;
use App\Models\Media;
use App\Models\User;

class ExternalPdfReference
{
    public static function supports(mixed $url): bool
    {
        if (! is_string($url) || trim($url) === '') {
            return false;
        }

        $parts = parse_url($url);
        if (! is_array($parts)
            || strtolower($parts['scheme'] ?? '') !== 'https'
            || empty($parts['host'])
            || isset($parts['user'])
            || isset($parts['pass'])) {
            return false;
        }

        $host = strtolower($parts['host']);
        $path = $parts['path'] ?? '';

        if (in_array($host, ['drive.google.com', 'docs.google.com'], true)) {
            return self::googleDriveFileId($parts) !== null;
        }

        $ip = trim($host, '[]');
        if (filter_var($ip, FILTER_VALIDATE_IP)
            && ! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return false;
        }

        if (! str_contains($host, '.')) {
            return false;
        }

        return str_ends_with(strtolower($path), '.pdf');
    }

    public function resolve(string $url, User $uploader): string
    {
        if (! self::supports($url)) {
            throw new \InvalidArgumentException('URL PDF eksternal tidak valid.');
        }

        $existing = Media::query()
            ->where('url', $url)
            ->where('type', MediaType::DOCUMENT->value)
            ->where('mimeType', 'application/pdf')
            ->first();
        if ($existing) {
            return $existing->id;
        }

        $parts = parse_url($url);
        $driveId = self::googleDriveFileId($parts);
        $pathName = $driveId ? 'google-drive-'.$driveId.'.pdf' : basename($parts['path'] ?? '');
        $filename = preg_replace('/[\x00-\x1F\x7F]/u', '', $pathName) ?? '';
        $filename = mb_substr(trim($filename, " .\t\n\r\0\x0B"), 0, 191);
        $filename = $filename !== '' ? $filename : 'external-document.pdf';

        return Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => $filename,
            'originalName' => $filename,
            'mimeType' => 'application/pdf',
            'size' => 0,
            'storageKey' => $url,
            'url' => $url,
            'uploadedById' => $uploader->id,
        ])->id;
    }

    public static function previewUrl(string $url): string
    {
        $parts = parse_url($url);
        $driveId = is_array($parts) ? self::googleDriveFileId($parts) : null;

        return $driveId
            ? 'https://drive.google.com/file/d/'.$driveId.'/preview'
            : $url;
    }

    private static function googleDriveFileId(array $parts): ?string
    {
        $host = strtolower($parts['host'] ?? '');
        if (! in_array($host, ['drive.google.com', 'docs.google.com'], true)) {
            return null;
        }

        $path = $parts['path'] ?? '';
        if (preg_match('~/file/d/([A-Za-z0-9_-]+)(?:/|$)~', $path, $matches) === 1) {
            return $matches[1];
        }

        if (in_array(trim($path, '/'), ['open', 'uc'], true)) {
            parse_str($parts['query'] ?? '', $query);
            $id = $query['id'] ?? null;

            return is_string($id) && preg_match('/^[A-Za-z0-9_-]+$/', $id) === 1 ? $id : null;
        }

        return null;
    }
}
