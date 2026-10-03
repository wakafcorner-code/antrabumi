<?php

namespace Tests\Unit;

use App\Services\RichTextSanitizer;
use PHPUnit\Framework\TestCase;

class RichTextSanitizerTest extends TestCase
{
    public function test_preserves_safe_editor_markup_and_removes_active_content(): void
    {
        $html = '<h2 onclick="alert(1)">Research</h2><p>Safe <strong>formatted</strong> text <a href="https://example.test" target="_blank">link</a><a href="javascript:alert(1)">unsafe</a><img src=x onerror="alert(1)"><script>alert(1)</script><iframe src="https://example.test"></iframe></p>';

        $sanitized = (new RichTextSanitizer())->sanitize($html);

        $this->assertStringContainsString('<h2>Research</h2>', $sanitized);
        $this->assertStringContainsString('<strong>formatted</strong>', $sanitized);
        $this->assertStringContainsString('href="https://example.test"', $sanitized);
        $this->assertStringContainsString('rel="noopener noreferrer"', $sanitized);
        $this->assertStringNotContainsString('onclick', $sanitized);
        $this->assertStringNotContainsString('onerror', $sanitized);
        $this->assertStringNotContainsString('javascript:', $sanitized);
        $this->assertStringNotContainsString('<script', $sanitized);
        $this->assertStringNotContainsString('<iframe', $sanitized);
        $this->assertStringNotContainsString('<img', $sanitized);
    }
}