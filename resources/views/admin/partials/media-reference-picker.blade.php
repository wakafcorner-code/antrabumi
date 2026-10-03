<div class="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
    <label for="{{ $fieldName }}-file" class="block text-xs font-semibold uppercase tracking-wide text-neutral-700">{{ $label }}</label>
    <input type="hidden" name="{{ $fieldName }}" id="{{ $fieldName }}" value="{{ old($fieldName, $initialMediaId) }}">
    <input type="hidden" name="{{ $fieldName }}Url" id="{{ $fieldName }}Url" value="{{ old($fieldName.'Url', $initialUrl) }}">

    <div id="{{ $fieldName }}-preview" @class(['hidden' => ! old($fieldName.'Url', $initialUrl), 'flex items-center gap-3'])>
        <img src="{{ old($fieldName.'Url', $initialUrl) }}" alt="Pratinjau {{ strtolower($label) }}" class="h-16 w-24 rounded-md border border-neutral-200 bg-white object-contain">
        <span id="{{ $fieldName }}-filename" class="min-w-0 truncate text-sm text-neutral-700"></span>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
        <div>
            <label for="{{ $fieldName }}-file" class="mb-1 block text-xs font-medium text-neutral-700">Unggah gambar</label>
            <input id="{{ $fieldName }}-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm">
        </div>
        <div>
            <label for="{{ $fieldName }}-url-input" class="mb-1 block text-xs font-medium text-neutral-700">Atau gunakan URL gambar</label>
            <div class="flex gap-2">
                <input id="{{ $fieldName }}-url-input" type="url" class="min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm" placeholder="https://example.org/image.jpg">
                <button id="{{ $fieldName }}-url-apply" type="button" class="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700">Pakai URL</button>
            </div>
        </div>
    </div>
    @error($fieldName)<p class="text-xs text-red-700">{{ $message }}</p>@enderror
    @error($fieldName.'Url')<p class="text-xs text-red-700">{{ $message }}</p>@enderror
    <p id="{{ $fieldName }}-error" class="hidden text-xs text-red-700" role="alert"></p>
    <p class="text-xs text-neutral-500">PNG, JPG, WebP, atau GIF. Maks. 15 MB. SVG mentah tidak diterima.</p>
</div>

<script>
    (() => {
        const fieldName = @json($fieldName);
        const mediaId = document.getElementById(fieldName);
        const mediaUrl = document.getElementById(`${fieldName}Url`);
        const fileInput = document.getElementById(`${fieldName}-file`);
        const urlInput = document.getElementById(`${fieldName}-url-input`);
        const preview = document.getElementById(`${fieldName}-preview`);
        const previewImage = preview.querySelector('img');
        const filename = document.getElementById(`${fieldName}-filename`);
        const errorOutput = document.getElementById(`${fieldName}-error`);
        const showPreview = (url, name) => {
            previewImage.src = url;
            filename.textContent = name || url;
            preview.classList.remove('hidden');
        };

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            errorOutput.textContent = '';
            errorOutput.classList.add('hidden');
            if (file.size > 15 * 1024 * 1024) {
                errorOutput.textContent = 'Ukuran gambar melebihi batas maksimum 15MB.';
                errorOutput.classList.remove('hidden');
                fileInput.value = '';
                return;
            }

            const uploadData = new FormData();
            uploadData.append('file', file);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
            try {
                const response = await fetch(@json(route('api.media.upload')), {
                    method: 'POST',
                    headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: uploadData,
                });
                const result = await response.json();
                if (!response.ok || !result.success || result.data?.type !== 'IMAGE') {
                    throw new Error(result.error ?? 'Gagal mengunggah gambar.');
                }

                mediaId.value = result.data.id;
                mediaUrl.value = result.data.url;
                urlInput.value = '';
                showPreview(result.data.url, result.data.filename || file.name);
            } catch (error) {
                errorOutput.textContent = error instanceof Error ? error.message : 'Gagal mengunggah gambar.';
                errorOutput.classList.remove('hidden');
            } finally {
                fileInput.value = '';
            }
        });

        document.getElementById(`${fieldName}-url-apply`).addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (!url) return;
            mediaId.value = '';
            mediaUrl.value = url;
            errorOutput.textContent = '';
            errorOutput.classList.add('hidden');
            showPreview(url, url.split('/').pop()?.split('?')[0] || url);
        });
    })();
</script>