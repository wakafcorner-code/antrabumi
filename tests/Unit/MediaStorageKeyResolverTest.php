<?php

namespace Tests\Unit;

use App\Http\Controllers\Public\StoredMediaController;
use App\Services\Media\MediaStorageKeyResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaStorageKeyResolverTest extends TestCase
{
    public function test_legacy_basename_resolves_under_the_configured_public_disk(): void
    {
        $resolver = new MediaStorageKeyResolver();
        $resolvedKey = $resolver->resolve('photo.jpg');

        $this->assertSame('uploads/photo.jpg', $resolvedKey);
        $this->assertPublicDiskPath($resolvedKey);
    }

    public function test_legacy_nested_key_resolves_under_uploads(): void
    {
        $this->assertSame('uploads/2026/photo.jpg', (new MediaStorageKeyResolver())->resolve('2026/photo.jpg'));
    }

    public function test_existing_laravel_upload_key_is_unchanged(): void
    {
        $resolver = new MediaStorageKeyResolver();
        $resolvedKey = $resolver->resolve('uploads/2026/photo.jpg');

        $this->assertSame('uploads/2026/photo.jpg', $resolvedKey);
        $this->assertPublicDiskPath($resolvedKey);
    }

    public function test_path_traversal_absolute_and_empty_keys_are_rejected(): void
    {
        $resolver = new MediaStorageKeyResolver();

        foreach (['../secret.txt', '2026/../../secret.txt', '/etc/passwd', 'C:\\secret.txt', '', "photo\0.jpg"] as $key) {
            $this->assertNull($resolver->resolve($key), $key);
        }

        $this->assertNull($resolver->resolve(null));
    }

    public function test_existing_media_file_route_and_legacy_url_route_resolve_without_dispatch(): void
    {
        $routes = Route::getRoutes();
        $mediaFileRoute = $routes->getByName('storage.media');
        $this->assertNotNull($mediaFileRoute);
        $this->assertSame(StoredMediaController::class.'@show', $mediaFileRoute->getActionName());
        $this->assertSame('storage.media', $routes->match(Request::create('/media-file/uploads/photo.jpg'))->getName());

        $this->assertSame('storage.media.legacy', $routes->match(Request::create('/uploads/photo.jpg'))->getName());
        $legacyRoute = $routes->getByName('storage.media.legacy');
        $this->assertNotNull($legacyRoute);
        $this->assertSame(StoredMediaController::class.'@showLegacy', $legacyRoute->getActionName());
    }

    private function assertPublicDiskPath(string $key): void
    {
        $diskRoot = rtrim(str_replace('\\', '/', config('filesystems.disks.public.root')), '/');

        $this->assertSame(
            $diskRoot.'/'.$key,
            str_replace('\\', '/', Storage::disk('public')->path($key))
        );
    }
}