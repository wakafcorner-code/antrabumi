@extends('layouts.admin')

@section('title', 'Konten Beranda — CMS ANTRABUMI')

@section('content')
@php
    $sections = [
        'whyUs' => [
            'title' => 'Mengapa Kami Hadir',
            'fields' => [
                'badge' => 'Label bagian (ID)', 'badgeEn' => 'Label bagian (EN)',
                'title' => 'Judul (ID)', 'titleEn' => 'Judul (EN)',
                'leadText' => 'Teks utama (ID)', 'leadTextEn' => 'Teks utama (EN)',
                'bridgeTitle' => 'Judul penghubung (ID)', 'bridgeTitleEn' => 'Judul penghubung (EN)',
                'bridgeText' => 'Deskripsi penghubung (ID)', 'bridgeTextEn' => 'Deskripsi penghubung (EN)',
                'imageUrl' => 'URL gambar',
            ],
            'multiline' => ['title', 'titleEn', 'leadText', 'leadTextEn', 'bridgeText', 'bridgeTextEn'],
        ],
        'about' => [
            'title' => 'Tentang ANTRABUMI & Pilar',
            'fields' => [
                'badge' => 'Label bagian (ID)', 'badgeEn' => 'Label bagian (EN)',
                'title' => 'Judul (ID)', 'titleEn' => 'Judul (EN)',
                'description' => 'Deskripsi (ID)', 'descriptionEn' => 'Deskripsi (EN)',
                'secondaryText' => 'Teks tambahan (ID)', 'secondaryTextEn' => 'Teks tambahan (EN)',
                'diagramUrl' => 'URL diagram',
            ],
            'multiline' => ['title', 'titleEn', 'description', 'descriptionEn', 'secondaryText', 'secondaryTextEn'],
        ],
        'growth' => [
            'title' => 'Linimasa Pertumbuhan',
            'fields' => [
                'badge' => 'Label bagian (ID)', 'badgeEn' => 'Label bagian (EN)',
                'title' => 'Judul (ID)', 'titleEn' => 'Judul (EN)',
                'leadText' => 'Teks pengantar (ID)', 'leadTextEn' => 'Teks pengantar (EN)',
            ],
            'multiline' => ['title', 'titleEn', 'leadText', 'leadTextEn'],
        ],
        'framework' => [
            'title' => 'Cara Kami Bekerja & GEDSI',
            'fields' => [
                'badge' => 'Label bagian (ID)', 'badgeEn' => 'Label bagian (EN)',
                'title' => 'Judul (ID)', 'titleEn' => 'Judul (EN)',
                'leadText' => 'Teks pengantar (ID)', 'leadTextEn' => 'Teks pengantar (EN)',
                'gedsiTitle' => 'Judul GEDSI (ID)', 'gedsiTitleEn' => 'Judul GEDSI (EN)',
                'gedsiText' => 'Deskripsi GEDSI (ID)', 'gedsiTextEn' => 'Deskripsi GEDSI (EN)',
            ],
            'multiline' => ['title', 'titleEn', 'leadText', 'leadTextEn', 'gedsiText', 'gedsiTextEn'],
        ],
        'cta' => [
            'title' => 'Ajakan Kolaborasi',
            'fields' => [
                'badge' => 'Label bagian (ID)', 'badgeEn' => 'Label bagian (EN)',
                'title' => 'Judul (ID)', 'titleEn' => 'Judul (EN)',
                'description' => 'Deskripsi (ID)', 'descriptionEn' => 'Deskripsi (EN)',
                'primaryButtonText' => 'Teks tombol utama (ID)', 'primaryButtonTextEn' => 'Teks tombol utama (EN)',
                'primaryButtonLink' => 'Link tombol utama',
                'secondaryButtonText' => 'Teks tombol kedua (ID)', 'secondaryButtonTextEn' => 'Teks tombol kedua (EN)',
                'secondaryButtonLink' => 'Link tombol kedua',
            ],
            'multiline' => ['title', 'titleEn', 'description', 'descriptionEn'],
        ],
    ];
    $repeaters = [
        'pillars' => [
            'title' => 'Pilar Utama',
            'fields' => ['id' => 'Nomor', 'key' => 'Kunci gambar (KNOWLEDGE/NATURE/COMMUNITIES)', 'label' => 'Nama (ID)', 'labelEn' => 'Nama (EN)', 'description' => 'Deskripsi (ID)', 'descriptionEn' => 'Deskripsi (EN)'],
            'multiline' => ['description', 'descriptionEn'],
        ],
        'growth.timeline' => [
            'title' => 'Tahun Linimasa',
            'fields' => ['year' => 'Tahun', 'label' => 'Judul (ID)', 'labelEn' => 'Judul (EN)', 'description' => 'Deskripsi (ID)', 'descriptionEn' => 'Deskripsi (EN)'],
            'multiline' => ['description', 'descriptionEn'],
        ],
        'framework.steps' => [
            'title' => 'Langkah Kerangka Kerja',
            'fields' => ['step' => 'Nomor langkah', 'title' => 'Nama langkah', 'desc' => 'Deskripsi (ID)', 'descEn' => 'Deskripsi (EN)'],
            'multiline' => ['desc', 'descEn'],
        ],
    ];
@endphp
<div class="mx-auto max-w-5xl space-y-6">
    <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Beranda</p>
        <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Konten &amp; Teks Beranda</h1>
        <p class="mt-2 text-sm text-neutral-600">Isi kolom bahasa Indonesia dan Inggris untuk setiap bagian. Kosongkan kolom bahasa Inggris untuk memakai teks bahasa Indonesia sebagai cadangan.</p>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif
    @if($errors->any())
        <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('admin.home-content.update') }}" class="space-y-5">
        @csrf
        @method('PUT')

        @foreach($sections as $section => $group)
            <section class="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="section-{{ $section }}">
                <h2 id="section-{{ $section }}" class="border-b border-neutral-100 pb-3 font-heading text-xl font-bold text-neutral-900">{{ $group['title'] }}</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    @foreach($group['fields'] as $key => $label)
                        @php
                            $path = $section.'.'.$key;
                        @endphp
                        @include('admin.beranda.partials.field', [
                            'name' => "content[$section][$key]",
                            'oldKey' => "content.$path",
                            'label' => $label,
                            'value' => data_get($content, $path),
                            'multiline' => in_array($key, $group['multiline'], true),
                            'type' => str_ends_with($key, 'Url') ? 'url' : 'text',
                            'imageUpload' => in_array($key, ['imageUrl', 'diagramUrl'], true),
                        ])
                    @endforeach
                </div>
            </section>
        @endforeach

        @foreach($repeaters as $path => $group)
            @php
                $items = data_get($content, $path, []);
            @endphp
            <section class="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="list-{{ str_replace('.', '-', $path) }}">
                <div class="border-b border-neutral-100 pb-3">
                    <h2 id="list-{{ str_replace('.', '-', $path) }}" class="font-heading text-xl font-bold text-neutral-900">{{ $group['title'] }}</h2>
                    <p class="mt-1 text-xs text-neutral-500">Edit baris yang tersedia. Susunan dan jumlah item saat ini dipertahankan.</p>
                </div>
                @foreach($items as $index => $item)
                    <fieldset class="space-y-4 rounded-lg border border-neutral-200 p-4">
                        <legend class="px-1 text-sm font-bold text-neutral-800">Item {{ $loop->iteration }}</legend>
                        <div class="grid gap-4 sm:grid-cols-2">
                            @foreach($group['fields'] as $key => $label)
                                @php
                                    $namePrefix = str_replace('.', '][', $path);
                                    $fieldPath = "$path.$index.$key";
                                @endphp
                                @include('admin.beranda.partials.field', [
                                    'name' => "content[$namePrefix][$index][$key]",
                                    'oldKey' => "content.$fieldPath",
                                    'label' => $label,
                                    'value' => data_get($item, $key),
                                    'multiline' => in_array($key, $group['multiline'], true),
                                    'type' => $key === 'year' ? 'number' : 'text',
                                ])
                            @endforeach
                        </div>
                    </fieldset>
                @endforeach
            </section>
        @endforeach

        <div class="flex justify-end border-t border-neutral-100 pt-4">
            <button type="submit" class="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700">Simpan Konten Beranda</button>
        </div>
    </form>
</div>
@endsection
