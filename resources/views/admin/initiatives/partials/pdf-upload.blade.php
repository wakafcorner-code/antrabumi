<div class="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
    <h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-800">Dokumen / Laporan PDF</h2>
    <input type="hidden" name="pdfMediaId" id="initiative-pdf-media-id" value="{{ old('pdfMediaId') }}">
    <div class="grid gap-3 md:grid-cols-2">
        <div>
            <label for="initiative-pdf-file" class="mb-1 block text-xs font-medium text-neutral-700">File PDF</label>
            <input id="initiative-pdf-file" type="file" accept="application/pdf,.pdf" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
        </div>
        <div>
            <label for="initiative-pdf-label" class="mb-1 block text-xs font-medium text-neutral-700">Label PDF (opsional)</label>
            <input id="initiative-pdf-label" name="pdfLabel" maxlength="191" value="{{ old('pdfLabel') }}" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
        </div>
    </div>
    <p id="initiative-pdf-upload-error" class="hidden text-xs text-red-700" role="alert"></p>
    <p id="initiative-pdf-uploaded-file" class="hidden text-xs text-emerald-700" role="status"></p>
    <p class="text-xs text-neutral-500">PDF maks. 15 MB. File akan diunggah dan dilampirkan saat disimpan.</p>
</div>

<script>
    (() => {
        const form = document.currentScript.closest('form');
        const fileInput = document.getElementById('initiative-pdf-file');
        const mediaIdInput = document.getElementById('initiative-pdf-media-id');
        const errorOutput = document.getElementById('initiative-pdf-upload-error');
        const uploadedOutput = document.getElementById('initiative-pdf-uploaded-file');
        const submitButton = form.querySelector('button[type="submit"]');
        let allowSubmit = false;

        form.addEventListener('submit', async (event) => {
            const file = fileInput.files?.[0];
            if (allowSubmit || !file) return;

            event.preventDefault();
            errorOutput.textContent = '';
            errorOutput.classList.add('hidden');

            if (file.size > 15 * 1024 * 1024) {
                errorOutput.textContent = 'Ukuran berkas melebihi batas maksimum 15MB.';
                errorOutput.classList.remove('hidden');
                return;
            }
            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                errorOutput.textContent = 'Hanya berkas format PDF yang diizinkan.';
                errorOutput.classList.remove('hidden');
                return;
            }

            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Mengunggah PDF...';
            try {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
                const response = await fetch(@json(route('api.media.upload')), {
                    method: 'POST',
                    headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: uploadData,
                });
                const result = await response.json();
                if (!response.ok || !result.success || result.data?.type !== 'DOCUMENT') {
                    throw new Error(result.error ?? 'Gagal mengunggah PDF.');
                }

                mediaIdInput.value = result.data.id;
                uploadedOutput.textContent = `${result.data.filename} siap dilampirkan.`;
                uploadedOutput.classList.remove('hidden');
                allowSubmit = true;
                form.requestSubmit();
            } catch (error) {
                errorOutput.textContent = error instanceof Error ? error.message : 'Gagal mengunggah PDF.';
                errorOutput.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    })();
</script>