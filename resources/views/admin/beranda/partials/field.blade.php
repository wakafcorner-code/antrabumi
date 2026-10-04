@php
    $fieldId = 'field-'.str_replace(['[', ']'], '-', $name);
    $multiline = $multiline ?? false;
    $type = $type ?? 'text';
    $imageUpload = $imageUpload ?? false;
@endphp
<div>
    <label for="{{ $fieldId }}" class="mb-1.5 block text-sm font-semibold text-neutral-800">{{ $label }}</label>
    @if($imageUpload)
        @php($fieldValue = old($oldKey, $value ?? ''))
        <div data-media-image-field class="space-y-3">
            <input id="{{ $fieldId }}" type="text" inputmode="url" name="{{ $name }}" value="{{ $fieldValue }}" data-media-url-input placeholder="https://... atau /media-file/..." class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0D5C4D] focus:outline-none">
            <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
                <label class="block text-xs font-medium text-neutral-700">atau unggah gambar (maks. 15MB)
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-media-image-upload class="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-2 py-2 text-xs">
                </label>
                <img data-media-image-preview src="{{ $fieldValue }}" alt="Pratinjau {{ $label }}" class="{{ $fieldValue ? '' : 'hidden' }} h-24 w-full rounded-lg border border-neutral-200 bg-neutral-100 object-cover">
            </div>
            <p data-media-upload-status class="hidden text-xs text-emerald-700" role="status"></p>
            <p data-media-upload-error class="hidden text-xs text-red-700" role="alert"></p>
        </div>
    @elseif($multiline)
        <textarea id="{{ $fieldId }}" name="{{ $name }}" rows="4" class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old($oldKey, $value ?? '') }}</textarea>
    @else
        <input id="{{ $fieldId }}" type="{{ $type }}" name="{{ $name }}" value="{{ old($oldKey, $value ?? '') }}" class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0D5C4D] focus:outline-none">
    @endif
</div>
