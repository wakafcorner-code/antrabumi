@php
    $videoFieldId = $idPrefix.'-video';
    $selectedVideoId = old('videoMediaId', $videoMediaId ?? '');
    $selectedVideoUrl = old('youtubeUrl', $youtubeUrl ?? '');
@endphp
<section class="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4" data-content-video>
    <div>
        <h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-800">Video (opsional)</h2>
        <p class="mt-1 text-xs text-neutral-500">Tambahkan URL YouTube atau unggah satu video MP4 (maks. 15 MB). Pilih salah satu.</p>
    </div>
    <input type="hidden" name="videoMediaId" id="{{ $videoFieldId }}-media-id" value="{{ $selectedVideoId }}">
    <div>
        <label for="{{ $videoFieldId }}-youtube-url" class="mb-1 block text-xs font-medium text-neutral-700">URL YouTube</label>
        <input id="{{ $videoFieldId }}-youtube-url" name="youtubeUrl" type="url" maxlength="500" value="{{ $selectedVideoUrl }}" placeholder="https://www.youtube.com/watch?v=..." class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
        <p class="mt-1 text-xs text-neutral-500">Tautan YouTube akan ditampilkan dengan embed aman. URL biasa seperti youtube.com/watch atau youtu.be didukung.</p>
        @error('youtubeUrl')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    <div>
        <label for="{{ $videoFieldId }}-file" class="mb-1 block text-xs font-medium text-neutral-700">Atau unggah video MP4</label>
        <input id="{{ $videoFieldId }}-file" type="file" accept="video/mp4,.mp4" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
        @error('videoMediaId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    <p id="{{ $videoFieldId }}-status" class="{{ $selectedVideoId ? '' : 'hidden' }} text-xs text-emerald-700" role="status">
        @if($selectedVideoId)
            {{ $videoMedia?->originalName ?: 'Video siap disimpan.' }}
        @endif
    </p>
    <progress id="{{ $videoFieldId }}-progress" max="100" value="0" class="hidden h-2 w-full accent-[#0D5C4D]" aria-label="Progres unggah video"></progress>
    <p id="{{ $videoFieldId }}-error" class="hidden text-xs text-red-700" role="alert"></p>
    <button type="button" id="{{ $videoFieldId }}-clear" class="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700">Hapus pilihan video</button>
</section>

<script>
    (() => {
        const field = document.currentScript.previousElementSibling;
        const form = field.closest('form');
        const mediaIdInput = field.querySelector('input[name="videoMediaId"]');
        const youtubeInput = field.querySelector('input[name="youtubeUrl"]');
        const fileInput = field.querySelector('input[type="file"]');
        const status = field.querySelector('[role="status"]');
        const error = field.querySelector('[role="alert"]');
        const progress = field.querySelector('progress');
        const clearButton = field.querySelector('button[type="button"]');
        const submitButton = form.querySelector('button[type="submit"]');
        let uploading = false;
        let submitAfterUpload = false;
        let allowSubmit = false;

        const showError = (message) => {
            error.textContent = message;
            error.classList.remove('hidden');
            status.classList.add('hidden');
        };

        youtubeInput.addEventListener('input', () => {
            if (!youtubeInput.value) return;
            mediaIdInput.value = '';
            fileInput.value = '';
            status.textContent = '';
            status.classList.add('hidden');
            error.classList.add('hidden');
        });

        clearButton.addEventListener('click', () => {
            mediaIdInput.value = '';
            youtubeInput.value = '';
            fileInput.value = '';
            status.textContent = '';
            status.classList.add('hidden');
            error.classList.add('hidden');
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            error.classList.add('hidden');
            if (file.size > 15 * 1024 * 1024) {
                showError('Ukuran video melebihi batas maksimum 15 MB.');
                fileInput.value = '';
                return;
            }
            if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
                showError('Hanya video MP4 yang didukung.');
                fileInput.value = '';
                return;
            }

            uploading = true;
            fileInput.disabled = true;
            youtubeInput.disabled = true;
            submitButton.disabled = true;
            status.textContent = 'Mengunggah video...';
            status.classList.remove('hidden');
            progress.value = 0;
            progress.classList.remove('hidden');

            const uploadData = new FormData();
            uploadData.append('file', file);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
            const request = new XMLHttpRequest();
            request.open('POST', @json(route('api.media.upload', [], false)));
            request.timeout = 600000;
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('X-CSRF-TOKEN', csrfToken);
            request.upload.addEventListener('progress', (event) => {
                if (!event.lengthComputable) return;
                progress.value = Math.round((event.loaded / event.total) * 100);
                status.textContent = progress.value >= 100 ? 'File terkirim, menunggu server...' : `Mengunggah video... ${progress.value}%`;
            });
            request.addEventListener('load', () => {
                try {
                    const result = JSON.parse(request.responseText);
                    if (request.status < 200 || request.status >= 300 || !result.success || result.data?.type !== 'VIDEO') {
                        throw new Error(result.error ?? 'Gagal mengunggah video.');
                    }
                    mediaIdInput.value = result.data.id;
                    youtubeInput.value = '';
                    status.textContent = `${result.data.filename} siap disimpan.`;
                } catch (uploadError) {
                    showError(uploadError instanceof Error ? uploadError.message : 'Gagal mengunggah video.');
                }
                finishUpload();
            });
            request.addEventListener('error', () => {
                showError('Koneksi gagal saat mengunggah video.');
                finishUpload();
            });
            request.addEventListener('abort', () => {
                showError('Unggahan video dibatalkan.');
                finishUpload();
            });
            request.addEventListener('timeout', () => {
                showError('Server belum menyelesaikan unggahan video. Coba lagi.');
                finishUpload();
            });
            request.send(uploadData);

            function finishUpload() {
                uploading = false;
                fileInput.disabled = false;
                youtubeInput.disabled = false;
                submitButton.disabled = false;
                fileInput.value = '';
                progress.classList.add('hidden');
                if (!submitAfterUpload) return;
                submitAfterUpload = false;
                if (error.classList.contains('hidden')) {
                    allowSubmit = true;
                    form.requestSubmit();
                }
            }
        });

        form.addEventListener('submit', (event) => {
            if (allowSubmit) {
                allowSubmit = false;
                return;
            }
            if (!uploading) return;
            event.preventDefault();
            submitAfterUpload = true;
        });
    })();
</script>
