<div data-image-slider data-label="{{ $label }}" class="space-y-3" @if(count($images) > 1) tabindex="0" @endif>
    <div class="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100">
        @foreach($images as $index => $image)
            <img data-image-slide src="{{ $image['url'] }}" alt="{{ $image['alt'] ?: $label }}" aria-hidden="{{ $index === 0 ? 'false' : 'true' }}" class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 {{ $index === 0 ? 'opacity-100' : 'pointer-events-none opacity-0' }}">
        @endforeach
        @if(count($images) > 1)
            <button type="button" data-image-prev aria-label="Gambar sebelumnya" class="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white hover:bg-black/70">‹</button>
            <button type="button" data-image-next aria-label="Gambar berikutnya" class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white hover:bg-black/70">›</button>
        @endif
    </div>
    @if(count($images) > 1)
        <div class="flex justify-center gap-1.5" aria-label="{{ $label }}"><span data-image-count class="sr-only">1 / {{ count($images) }}</span>@foreach($images as $index => $image)<button type="button" data-image-indicator aria-label="Tampilkan gambar {{ $index + 1 }}" aria-current="{{ $index === 0 ? 'true' : 'false' }}" class="h-1.5 rounded-full transition-all {{ $index === 0 ? 'w-6 bg-[#0D5C4D]' : 'w-1.5 bg-neutral-300' }}"></button>@endforeach</div>
    @endif
</div>