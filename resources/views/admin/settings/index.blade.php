@extends('layouts.admin')

@section('title', 'Pengaturan Situs — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-5xl space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Sistem</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Pengaturan Situs</h1>
        </div>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif
    @if($errors->any())
        <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        @method('PUT')

        <div class="grid gap-5 md:grid-cols-2">
            <div>
                <label for="site_name" class="mb-2 block text-sm font-medium text-neutral-700">Nama Situs</label>
                <input id="site_name" name="site_name" type="text" value="{{ old('site_name', $settings['site_name']->value ?? 'ANTRABUMI') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="site_tagline" class="mb-2 block text-sm font-medium text-neutral-700">Tagline</label>
                <input id="site_tagline" name="site_tagline" type="text" value="{{ old('site_tagline', $settings['site_tagline']->value ?? 'Connecting Knowledge, Nature, & Communities.') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="contact_email" class="mb-2 block text-sm font-medium text-neutral-700">Email</label>
                <input id="contact_email" name="contact_email" type="email" value="{{ old('contact_email', $settings['contact_email']->value ?? 'hello@antrabumi.org') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="contact_phone" class="mb-2 block text-sm font-medium text-neutral-700">Nomor Telepon</label>
                <input id="contact_phone" name="contact_phone" type="text" value="{{ old('contact_phone', $settings['contact_phone']->value ?? '+62-823-3038-7505') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div class="md:col-span-2">
                <label for="contact_address" class="mb-2 block text-sm font-medium text-neutral-700">Alamat</label>
                <input id="contact_address" name="contact_address" type="text" value="{{ old('contact_address', $settings['contact_address']->value ?? 'TRIGHA Creative Hub, Sudirman St, 08, Belitung') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="site_logo_url" class="mb-2 block text-sm font-medium text-neutral-700">Logo Light URL</label>
                <input id="site_logo_url" name="site_logo_url" type="text" value="{{ old('site_logo_url', $settings['site_logo_url']->value ?? '/brand/logo.svg') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
                <label for="site-logo-light-file" class="mt-2 block text-xs font-medium text-neutral-600">Unggah versi raster</label>
                <input id="site-logo-light-file" data-logo-setting-upload="site_logo_url" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
                <div class="mt-3 flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                    <img data-logo-preview-for="site_logo_url" src="{{ old('site_logo_url', $settings['site_logo_url']->value ?? '/brand/logo.svg') }}" alt="Pratinjau logo utama" class="h-12 w-28 rounded bg-white object-contain p-2">
                    <div class="min-w-0">
                        <p data-logo-upload-status class="hidden text-xs font-medium text-emerald-700" role="status"></p>
                        <p class="text-xs leading-relaxed text-neutral-500">Setelah unggah atau mengubah URL, klik Simpan Pengaturan untuk menerapkan logo.</p>
                    </div>
                </div>
            </div>
            <div>
                <label for="site_logo_dark_url" class="mb-2 block text-sm font-medium text-neutral-700">Logo Dark URL</label>
                <input id="site_logo_dark_url" name="site_logo_dark_url" type="text" value="{{ old('site_logo_dark_url', $settings['site_logo_dark_url']->value ?? '/brand/logo-white.svg') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
                <label for="site-logo-dark-file" class="mt-2 block text-xs font-medium text-neutral-600">Unggah versi raster</label>
                <input id="site-logo-dark-file" data-logo-setting-upload="site_logo_dark_url" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
                <div class="mt-3 flex items-center gap-3 rounded-xl border border-neutral-200 bg-[#0B1E1A] p-3">
                    <img data-logo-preview-for="site_logo_dark_url" src="{{ old('site_logo_dark_url', $settings['site_logo_dark_url']->value ?? '/brand/logo-white.svg') }}" alt="Pratinjau logo footer" class="h-12 w-28 rounded bg-white/10 object-contain p-2">
                    <div class="min-w-0">
                        <p data-logo-upload-status class="hidden text-xs font-medium text-emerald-300" role="status"></p>
                        <p class="text-xs leading-relaxed text-neutral-300">Setelah unggah atau mengubah URL, klik Simpan Pengaturan untuk menerapkan logo.</p>
                    </div>
                </div>
            </div>
            <div>
                <label for="instagram_url" class="mb-2 block text-sm font-medium text-neutral-700">Instagram</label>
                <input id="instagram_url" name="instagram_url" type="url" value="{{ old('instagram_url', $settings['instagram_url']->value ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="linkedin_url" class="mb-2 block text-sm font-medium text-neutral-700">LinkedIn</label>
                <input id="linkedin_url" name="linkedin_url" type="url" value="{{ old('linkedin_url', $settings['linkedin_url']->value ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="youtube_url" class="mb-2 block text-sm font-medium text-neutral-700">YouTube</label>
                <input id="youtube_url" name="youtube_url" type="url" value="{{ old('youtube_url', $settings['youtube_url']->value ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="twitter_url" class="mb-2 block text-sm font-medium text-neutral-700">X / Twitter</label>
                <input id="twitter_url" name="twitter_url" type="url" value="{{ old('twitter_url', $settings['twitter_url']->value ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="facebook_url" class="mb-2 block text-sm font-medium text-neutral-700">Facebook</label>
                <input id="facebook_url" name="facebook_url" type="url" value="{{ old('facebook_url', $settings['facebook_url']->value ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="whatsapp_url" class="mb-2 block text-sm font-medium text-neutral-700">WhatsApp URL</label>
                <input id="whatsapp_url" name="whatsapp_url" type="url" value="{{ old('whatsapp_url', $settings['whatsapp_url']->value ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
        </div>

        <div class="flex justify-end gap-3">
            <button type="submit" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">Simpan Pengaturan</button>
        </div>
    </form>
</div>

<script>
    (() => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
        const uploadEndpoint = document.querySelector('meta[name="media-upload-url"]')?.content || '/api/media/upload';
        document.querySelectorAll('[data-logo-setting-upload]').forEach((input) => {
            const urlInput = document.getElementById(input.dataset.logoSettingUpload);
            const preview = document.querySelector(`[data-logo-preview-for="${input.dataset.logoSettingUpload}"]`);
            const status = input.closest('div')?.querySelector('[data-logo-upload-status]');

            urlInput?.addEventListener('input', () => {
                if (preview) preview.src = urlInput.value;
            });

            input.addEventListener('change', async () => {
                const file = input.files?.[0];
                if (!file) return;

                if (file.size > 15 * 1024 * 1024) {
                    if (status) {
                        status.textContent = 'Ukuran berkas melebihi batas maksimum 15MB.';
                        status.classList.remove('hidden');
                        status.classList.remove('text-emerald-700', 'text-emerald-300');
                        status.classList.add(input.dataset.logoSettingUpload === 'site_logo_url' ? 'text-red-700' : 'text-red-300');
                    }
                    input.value = '';
                    return;
                }

                if (status) {
                    status.textContent = 'Mengunggah logo...';
                    status.classList.remove('hidden');
                    status.classList.remove('text-red-700', 'text-red-300');
                    status.classList.add(input.dataset.logoSettingUpload === 'site_logo_url' ? 'text-emerald-700' : 'text-emerald-300');
                }
                input.disabled = true;
                const data = new FormData();
                data.append('file', file);
                data.append('altText', input.dataset.logoSettingUpload === 'site_logo_url' ? 'Logo ANTRABUMI utama' : 'Logo ANTRABUMI versi gelap');
                try {
                    const response = await fetch(uploadEndpoint, {
                        method: 'POST',
                        headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                        body: data,
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success || result.data?.type !== 'IMAGE') {
                        throw new Error(result.error ?? 'Gagal mengunggah logo.');
                    }

                    urlInput.value = result.data.url;
                    if (preview) preview.src = result.data.url;
                    if (status) status.textContent = `${result.data.filename} berhasil diunggah. Klik Simpan Pengaturan untuk menerapkan logo.`;
                } catch (error) {
                    if (status) {
                        status.textContent = error instanceof Error ? error.message : 'Gagal mengunggah logo.';
                        status.classList.remove('text-emerald-700', 'text-emerald-300');
                        status.classList.add(input.dataset.logoSettingUpload === 'site_logo_url' ? 'text-red-700' : 'text-red-300');
                    }
                } finally {
                    input.disabled = false;
                    input.value = '';
                }
            });
        });
    })();
</script>
@endsection
