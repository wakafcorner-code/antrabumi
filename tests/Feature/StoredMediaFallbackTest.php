<?php

namespace Tests\Feature;

use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StoredMediaFallbackTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_disk_builds_urls_for_the_custom_fallback_route(): void
    {
        $this->assertStringEndsWith('/media-file', config('filesystems.disks.public.url'));
        $this->assertStringContainsString('/media-file/uploads/example.png', Storage::disk('public')->url('uploads/example.png'));
    }

    public function test_storage_fallback_serves_only_registered_media(): void
    {
        Storage::fake('public');
        $user = User::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        Storage::disk('public')->put('uploads/public-image.png', 'valid-image-bytes');
        $media = Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'public-image.png',
            'originalName' => 'public-image.png',
            'mimeType' => 'image/png',
            'size' => 17,
            'storageKey' => 'uploads/public-image.png',
            'uploadedById' => $user->id,
        ]);

        $this->get(route('storage.media', ['path' => 'uploads/public-image.png']))
            ->assertOk()
            ->assertHeader('Content-Type', 'image/png')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertStreamedContent('valid-image-bytes');

        $this->get('/media-file/uploads/not-registered.png')->assertNotFound();
    }

    public function test_registered_pdf_is_served_inline_for_browser_preview(): void
    {
        Storage::fake('public');
        $user = User::create([
            'name' => 'Editor',
            'email' => 'pdf-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $pdfBytes = "%PDF-1.7\nPDF preview";
        Storage::disk('public')->put('uploads/report.pdf', $pdfBytes);
        Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'report.pdf',
            'originalName' => 'report.pdf',
            'mimeType' => 'application/pdf',
            'size' => strlen($pdfBytes),
            'storageKey' => 'uploads/report.pdf',
            'uploadedById' => $user->id,
        ]);

        $this->get('/media-file/uploads/report.pdf')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/pdf')
            ->assertHeader('Content-Disposition', 'inline; filename=report.pdf')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertStreamedContent($pdfBytes);
    }

    public function test_legacy_svg_media_is_never_served_inline(): void
    {
        Storage::fake('public');
        $user = User::create([
            'name' => 'Editor',
            'email' => 'svg-editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $unsafeSvg = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(1)</script></svg>';
        Storage::disk('public')->put('uploads/legacy.svg', $unsafeSvg);
        Media::create([
            'type' => MediaType::IMAGE,
            'filename' => 'legacy.svg',
            'originalName' => 'legacy.svg',
            'mimeType' => 'image/svg+xml',
            'size' => strlen($unsafeSvg),
            'storageKey' => 'uploads/legacy.svg',
            'uploadedById' => $user->id,
        ]);

        $response = $this->get('/media-file/uploads/legacy.svg')
            ->assertOk()
            ->assertHeader('Content-Type', 'image/svg+xml')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertStreamedContent($unsafeSvg);

        $this->assertStringStartsWith('attachment;', $response->headers->get('Content-Disposition'));
        $this->assertSame('sandbox', $response->headers->get('Content-Security-Policy'));
    }

    public function test_static_robots_file_blocks_admin_and_api_crawling(): void
    {
        $robots = File::get(public_path('robots.txt'));

        $this->assertStringContainsString('Disallow: /admin/', $robots);
        $this->assertStringContainsString('Disallow: /api/', $robots);
        $this->get(route('robots'))->assertOk()->assertSee('Disallow: /admin/', false);
    }
}
