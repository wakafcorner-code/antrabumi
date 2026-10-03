<?php

namespace App\Services;

use DOMDocument;
use DOMElement;
use DOMNode;
use RuntimeException;

final class RichTextSanitizer
{
    private const ALLOWED_TAGS = [
        'a', 'blockquote', 'br', 'code', 'del', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'hr', 'i', 'li', 'ol', 'p', 'pre', 's', 'span', 'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
    ];

    private const DROP_TAGS = ['audio', 'button', 'embed', 'form', 'iframe', 'input', 'math', 'object', 'script', 'source', 'style', 'svg', 'textarea', 'video'];

    public function sanitize(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        if (! class_exists(DOMDocument::class)) {
            throw new RuntimeException('The PHP DOM extension is required to render rich text safely.');
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        $previousErrorMode = libxml_use_internal_errors(true);
        try {
            $document->loadHTML(
                '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="rich-content-root">'.$html.'</div></body></html>',
                LIBXML_NONET | LIBXML_HTML_NODEFDTD
            );
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previousErrorMode);
        }

        $root = $document->getElementById('rich-content-root');
        if (! $root) {
            return '';
        }

        $this->sanitizeChildren($root);
        $output = '';
        foreach ($root->childNodes as $child) {
            $output .= $document->saveHTML($child);
        }

        return $output;
    }

    private function sanitizeChildren(DOMNode $parent): void
    {
        $children = [];
        foreach ($parent->childNodes as $child) {
            $children[] = $child;
        }

        foreach ($children as $child) {
            if (! $child instanceof DOMElement) {
                continue;
            }

            $tag = strtolower($child->tagName);
            if (in_array($tag, self::DROP_TAGS, true)) {
                $parent->removeChild($child);
                continue;
            }

            $this->sanitizeChildren($child);
            if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                while ($child->firstChild) {
                    $parent->insertBefore($child->firstChild, $child);
                }
                $parent->removeChild($child);
                continue;
            }

            $this->sanitizeAttributes($child, $tag);
        }
    }

    private function sanitizeAttributes(DOMElement $element, string $tag): void
    {
        $attributes = [];
        foreach ($element->attributes as $attribute) {
            $attributes[] = $attribute->name;
        }

        foreach ($attributes as $name) {
            if ($tag !== 'a' || ! in_array(strtolower($name), ['href', 'target', 'rel'], true)) {
                $element->removeAttribute($name);
            }
        }

        if ($tag !== 'a') {
            return;
        }

        $href = trim($element->getAttribute('href'));
        $scheme = parse_url($href, PHP_URL_SCHEME);
        if (str_starts_with($href, '//') || ($scheme !== null && ! in_array(strtolower($scheme), ['http', 'https', 'mailto', 'tel'], true))) {
            $element->removeAttribute('href');
        }

        if ($element->getAttribute('target') === '_blank') {
            $element->setAttribute('rel', 'noopener noreferrer');
        } elseif ($element->hasAttribute('target') && $element->getAttribute('target') !== '_self') {
            $element->removeAttribute('target');
        }
    }
}