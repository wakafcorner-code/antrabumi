@extends('layouts.admin')

@section('title', 'Hero Slider — CMS ANTRABUMI')

@section('content')
@php
    $formSlides = old('slides');
    $formSlides = is_array($formSlides) ? $formSlides : $slides;
    $slideFields = [
        'tagline' => ['Tagline (ID)', 'text'],
        'taglineEn' => ['Tagline (EN)', 'text'],
        'title' => ['Judul (ID)', 'text'],
        'titleEn' => ['Judul (EN)', 'text'],
        'subtitle' => ['Deskripsi (ID)', 'textarea'],
        'subtitleEn' => ['Deskripsi (EN)', 'textarea'],
        'primaryCtaText' => ['Teks tombol utama (ID)', 'text'],
        'primaryCtaTextEn' => ['Teks tombol utama (EN)', 'text'],
        'primaryCtaLink' => ['Link tombol utama', 'text'],
        'secondaryCtaText' => ['Teks tombol kedua (ID)', 'text'],
        'secondaryCtaTextEn' => ['Teks tombol kedua (EN)', 'text'],
        'secondaryCtaLink' => ['Link tombol kedua', 'text'],
        'imageUrl' => ['URL gambar', 'url'],
    ];
@endphp
<div class="mx-auto max-w-5xl space-y-6">
    <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Beranda</p>
        <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Hero Slider Beranda</h1>
        <p class="mt-2 text-sm text-neutral-600">Atur teks, tautan, gambar, dan status untuk setiap slide.</p>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif
    @if($errors->any())
        <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('admin.hero.update') }}" class="space-y-6">
        @csrf
        @method('PUT')

        <div class="space-y-5" data-slide-list data-next-index="{{ count($formSlides) }}">
            @foreach($formSlides as $index => $slide)
                <fieldset class="space-y-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6" data-slide-item>
                    <div class="flex items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                        <h2 class="font-heading text-lg font-bold text-neutral-900">Slide <span data-slide-number>{{ $loop->iteration }}</span></h2>
                        <button type="button" class="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" data-remove-slide>Hapus slide</button>
                    </div>
                    <input type="hidden" name="slides[{{ $index }}][id]" value="{{ old("slides.$index.id", $slide['id'] ?? '') }}">
                    <div class="grid min-w-0 gap-4 sm:grid-cols-2">
                        @foreach($slideFields as $key => [$label, $type])
                            @php
                                $fieldId = "slide-$index-$key";
                                $fieldName = "slides[$index][$key]";
                                $fieldValue = old("slides.$index.$key", $slide[$key] ?? '');
                            @endphp
                            <div class="min-w-0 @if(in_array($key, ['subtitle', 'subtitleEn', 'imageUrl'])) sm:col-span-2 @endif">
                                <label for="{{ $fieldId }}" class="mb-1.5 block text-sm font-semibold text-neutral-800">{{ $label }}@if($key === 'title') <span class="text-red-700">*</span>@endif</label>
                                @if($key === 'imageUrl')
                                    <div data-media-image-field class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
                                        <div class="space-y-2">
                                            <input id="{{ $fieldId }}" type="text" inputmode="url" name="{{ $fieldName }}" value="{{ $fieldValue }}" data-media-url-input class="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0D5C4D] focus:outline-none" placeholder="https://... atau /media-file/...">
                                            <label class="block text-xs font-medium text-neutral-700">atau unggah gambar (maks. 15MB)
                                                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-media-image-upload class="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-2 py-2 text-xs">
                                            </label>
                                            <p data-media-upload-status class="hidden text-xs text-emerald-700" role="status"></p>
                                            <p data-media-upload-error class="hidden text-xs text-red-700" role="alert"></p>
                                        </div>
                                        <img data-media-image-preview src="{{ $fieldValue }}" alt="Pratinjau gambar slide" class="{{ $fieldValue ? '' : 'hidden' }} h-28 w-full rounded-lg border border-neutral-200 bg-neutral-100 object-cover">
                                    </div>
                                @elseif($type === 'textarea')
                                    <textarea id="{{ $fieldId }}" name="{{ $fieldName }}" rows="3" class="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ $fieldValue }}</textarea>
                                @else
                                    <input id="{{ $fieldId }}" type="{{ $type }}" name="{{ $fieldName }}" value="{{ $fieldValue }}" @if($key === 'title') required @endif class="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0D5C4D] focus:outline-none">
                                @endif
                            </div>
                        @endforeach
                    </div>
                    <div class="grid gap-4 border-t border-neutral-100 pt-4 sm:grid-cols-3">
                        <div>
                            <label for="slide-{{ $index }}-order" class="mb-1.5 block text-sm font-semibold text-neutral-800">Urutan</label>
                            <input id="slide-{{ $index }}-order" type="number" name="slides[{{ $index }}][order]" value="{{ old("slides.$index.order", $slide['order'] ?? $loop->iteration) }}" class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                        </div>
                        <label class="flex items-center gap-2 self-end pb-2 text-sm font-semibold text-neutral-800">
                            <input type="hidden" name="slides[{{ $index }}][isActive]" value="0">
                            <input type="checkbox" name="slides[{{ $index }}][isActive]" value="1" @checked((bool) old("slides.$index.isActive", $slide['isActive'] ?? false)) class="rounded border-neutral-300 text-brand-teal focus:ring-brand-teal">
                            Aktif
                        </label>
                    </div>
                </fieldset>
            @endforeach
        </div>
        @error('slides')<p class="text-sm text-red-700">{{ $message }}</p>@enderror

        <template id="new-slide-template">
            <fieldset class="space-y-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6" data-slide-item>
                <div class="flex items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                    <h2 class="font-heading text-lg font-bold text-neutral-900">Slide <span data-slide-number></span></h2>
                    <button type="button" class="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" data-remove-slide>Hapus slide</button>
                </div>
                <input type="hidden" name="slides[__INDEX__][id]" value="__SLIDE_ID__">
                <div class="grid min-w-0 gap-4 sm:grid-cols-2">
                    @foreach($slideFields as $key => [$label, $type])
                        <div class="min-w-0 @if(in_array($key, ['subtitle', 'subtitleEn', 'imageUrl'])) sm:col-span-2 @endif">
                            <label for="slide-__INDEX__-{{ $key }}" class="mb-1.5 block text-sm font-semibold text-neutral-800">{{ $label }}@if($key === 'title') <span class="text-red-700">*</span>@endif</label>
                            @if($key === 'imageUrl')
                                <div data-media-image-field class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
                                    <div class="space-y-2">
                                        <input id="slide-__INDEX__-imageUrl" type="text" inputmode="url" name="slides[__INDEX__][imageUrl]" data-media-url-input class="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="https://... atau /media-file/...">
                                        <label class="block text-xs font-medium text-neutral-700">atau unggah gambar (maks. 15MB)
                                            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-media-image-upload class="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-2 py-2 text-xs">
                                        </label>
                                        <p data-media-upload-status class="hidden text-xs text-emerald-700" role="status"></p>
                                        <p data-media-upload-error class="hidden text-xs text-red-700" role="alert"></p>
                                    </div>
                                    <img data-media-image-preview alt="Pratinjau gambar slide" class="hidden h-28 w-full rounded-lg border border-neutral-200 bg-neutral-100 object-cover">
                                </div>
                            @elseif($type === 'textarea')
                                <textarea id="slide-__INDEX__-{{ $key }}" name="slides[__INDEX__][{{ $key }}]" rows="3" class="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm"></textarea>
                            @else
                                <input id="slide-__INDEX__-{{ $key }}" type="{{ $type }}" name="slides[__INDEX__][{{ $key }}]" @if($key === 'title') required @endif class="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                            @endif
                        </div>
                    @endforeach
                </div>
                <div class="grid gap-4 border-t border-neutral-100 pt-4 sm:grid-cols-3">
                    <div>
                        <label for="slide-__INDEX__-order" class="mb-1.5 block text-sm font-semibold text-neutral-800">Urutan</label>
                        <input id="slide-__INDEX__-order" type="number" name="slides[__INDEX__][order]" value="1" class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                    </div>
                    <label class="flex items-center gap-2 self-end pb-2 text-sm font-semibold text-neutral-800">
                        <input type="hidden" name="slides[__INDEX__][isActive]" value="0">
                        <input type="checkbox" name="slides[__INDEX__][isActive]" value="1" checked class="rounded border-neutral-300 text-brand-teal focus:ring-brand-teal">
                        Aktif
                    </label>
                </div>
            </fieldset>
        </template>
        <button type="button" class="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50" data-add-slide>+ Tambah slide</button>

        <section class="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="slider-config-heading">
            <div>
                <h2 id="slider-config-heading" class="font-heading text-xl font-bold text-neutral-900">Konfigurasi slider</h2>
                <p class="mt-1 text-sm text-neutral-600">Atur perilaku pergantian slide di halaman beranda.</p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
                <label class="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                    <input type="hidden" name="config[autoplay]" value="0">
                    <input type="checkbox" name="config[autoplay]" value="1" @checked((bool) old('config.autoplay', $config['autoplay'] ?? false)) class="rounded border-neutral-300 text-brand-teal focus:ring-brand-teal">
                    Putar otomatis
                </label>
                <label class="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                    <input type="hidden" name="config[pauseOnHover]" value="0">
                    <input type="checkbox" name="config[pauseOnHover]" value="1" @checked((bool) old('config.pauseOnHover', $config['pauseOnHover'] ?? false)) class="rounded border-neutral-300 text-brand-teal focus:ring-brand-teal">
                    Jeda saat kursor diarahkan
                </label>
                <div>
                    <label for="config-interval" class="mb-1.5 block text-sm font-semibold text-neutral-800">Interval (milidetik)</label>
                    <input id="config-interval" type="number" min="2000" max="30000" step="500" name="config[intervalMs]" value="{{ old('config.intervalMs', $config['intervalMs'] ?? 6000) }}" required class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                    @error('config.intervalMs')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                </div>
                <div>
                    <label for="config-effect" class="mb-1.5 block text-sm font-semibold text-neutral-800">Efek transisi</label>
                    <select id="config-effect" name="config[transitionEffect]" class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                        <option value="fade" @selected(old('config.transitionEffect', $config['transitionEffect'] ?? 'fade') === 'fade')>Fade</option>
                        <option value="slide" @selected(old('config.transitionEffect', $config['transitionEffect'] ?? 'fade') === 'slide')>Slide</option>
                    </select>
                    @error('config.transitionEffect')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                </div>
            </div>
            @error('config')<p class="text-sm text-red-700">{{ $message }}</p>@enderror
        </section>

        <div class="flex justify-end">
            <button type="submit" class="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700">Simpan Pengaturan Slider</button>
        </div>
    </form>
</div>

<script>
    (() => {
        const list = document.querySelector('[data-slide-list]');
        const template = document.getElementById('new-slide-template');
        let nextIndex = Number(list.dataset.nextIndex);

        const refreshNumbers = () => {
            list.querySelectorAll('[data-slide-number]').forEach((number, index) => {
                number.textContent = String(index + 1);
            });
        };
        const form = list.closest('form');

        form.addEventListener('submit', () => {
            list.querySelectorAll('[data-slide-item]').forEach((item, index) => {
                item.querySelectorAll('[name]').forEach((field) => {
                    field.name = field.name.replace(/slides\[\d+\]/, `slides[${index}]`);
                });
                item.querySelectorAll('[id]').forEach((field) => {
                    field.id = field.id.replace(/slide-\d+-/, `slide-${index}-`);
                });
                item.querySelectorAll('label[for]').forEach((label) => {
                    label.htmlFor = label.htmlFor.replace(/slide-\d+-/, `slide-${index}-`);
                });
            });
        });

        list.addEventListener('click', (event) => {
            const removeButton = event.target.closest('[data-remove-slide]');
            if (!removeButton) return;

            if (list.querySelectorAll('[data-slide-item]').length === 1) {
                window.alert('Hero harus memiliki minimal satu slide.');
                return;
            }

            removeButton.closest('[data-slide-item]').remove();
            refreshNumbers();
        });

        document.querySelector('[data-add-slide]').addEventListener('click', () => {
            const index = nextIndex++;
            const slideId = `slide-${Date.now()}-${index}`;
            const markup = template.innerHTML
                .replaceAll('__INDEX__', String(index))
                .replaceAll('__SLIDE_ID__', slideId);
            list.insertAdjacentHTML('beforeend', markup);
            refreshNumbers();
        });
    })();
</script>
@endsection
