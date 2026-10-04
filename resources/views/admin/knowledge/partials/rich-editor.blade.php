@php
    $safeEditorHtml = app(\App\Services\RichTextSanitizer::class)->sanitize((string) $value);
@endphp
<div class="space-y-2" data-rich-editor-container>
    <div class="flex flex-wrap items-center justify-between gap-2">
        <label for="{{ $id }}-editor" class="block text-xs font-semibold uppercase tracking-wide text-neutral-600">{{ $label }}</label>
        <span class="text-[11px] text-neutral-500">Gunakan toolbar untuk judul, tebal, daftar, atau kutipan.</span>
    </div>
    <div class="overflow-hidden rounded-xl border border-neutral-300 bg-white focus-within:border-[#0D5C4D] focus-within:ring-2 focus-within:ring-[#0D5C4D]/10">
        <div data-rich-editor-toolbar class="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 p-2" role="toolbar" aria-label="Pemformatan {{ $label }}">
            <button type="button" data-rich-command="bold" class="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-bold text-neutral-800 hover:bg-neutral-100" aria-label="Tebal">B</button>
            <button type="button" data-rich-command="italic" class="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs italic text-neutral-800 hover:bg-neutral-100" aria-label="Miring">I</button>
            <button type="button" data-rich-command="formatBlock" data-rich-value="h2" class="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-100">Judul</button>
            <button type="button" data-rich-command="formatBlock" data-rich-value="p" class="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-800 hover:bg-neutral-100">Paragraf</button>
            <button type="button" data-rich-command="insertUnorderedList" class="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-800 hover:bg-neutral-100">• Daftar</button>
            <button type="button" data-rich-command="insertOrderedList" class="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-800 hover:bg-neutral-100">1. Daftar</button>
            <button type="button" data-rich-command="formatBlock" data-rich-value="blockquote" class="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-800 hover:bg-neutral-100">Kutipan</button>
        </div>
        <div id="{{ $id }}-editor" data-rich-editor contenteditable="true" role="textbox" aria-multiline="true" aria-label="{{ $label }}" class="rich-content min-h-[24rem] max-w-none overflow-y-auto px-4 py-4 text-sm leading-7 text-neutral-800 outline-none sm:min-h-[30rem] sm:px-6">{!! $safeEditorHtml !!}</div>
    </div>
    <textarea id="{{ $id }}" name="{{ $name }}" data-rich-editor-source class="hidden" aria-hidden="true">{{ $value }}</textarea>
    @if(isset($errorKey))
        @error($errorKey)<p class="text-xs text-red-700">{{ $message }}</p>@enderror
    @endif
</div>
