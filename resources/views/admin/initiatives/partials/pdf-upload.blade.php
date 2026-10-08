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
    <div>
        <label for="initiative-pdf-url" class="mb-1 block text-xs font-medium text-neutral-700">Atau URL PDF / Google Drive</label>
        <input id="initiative-pdf-url" name="pdfUrl" type="url" maxlength="191" value="{{ old('pdfUrl') }}" placeholder="https://drive.google.com/file/d/... atau https://contoh.org/dokumen.pdf" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
        @error('pdfUrl')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        <p class="mt-1 text-xs text-neutral-500">Pastikan akses Google Drive diatur ke “Siapa saja yang memiliki link”. URL harus memakai HTTPS.</p>
    </div>
    <p id="initiative-pdf-upload-error" class="hidden text-xs text-red-700" role="alert"></p>
    <p id="initiative-pdf-uploaded-file" class="hidden text-xs text-emerald-700" role="status"></p>
    <progress id="initiative-pdf-upload-progress" max="100" value="0" class="hidden h-2 w-full accent-[#0D5C4D]" aria-label="Progres unggah PDF"></progress>
    <p class="text-xs text-neutral-500">PDF maks. 15 MB. Setelah memilih file, tunggu sampai status unggahan siap lalu klik Simpan.</p>
</div>

<script>
    (() => {
        const form = document.currentScript.closest('form');
        const fileInput = document.getElementById('initiative-pdf-file');
        const mediaIdInput = document.getElementById('initiative-pdf-media-id');
        const pdfUrlInput = document.getElementById('initiative-pdf-url');
        const errorOutput = document.getElementById('initiative-pdf-upload-error');
        const uploadedOutput = document.getElementById('initiative-pdf-uploaded-file');
        const submitButton = form.querySelector('button[type="submit"]');
        let allowSubmit = false;
        let uploading = false;
        let submitAfterUpload = false;

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            pdfUrlInput.value = '';
            mediaIdInput.value = '';
            errorOutput.textContent = '';
            errorOutput.classList.add('hidden');

            if (file.size > 15 * 1024 * 1024) {
                errorOutput.textContent = 'Ukuran berkas melebihi batas maksimum 15MB.';
                errorOutput.classList.remove('hidden');
                fileInput.value = '';
                return;
            }
            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                errorOutput.textContent = 'Hanya berkas format PDF yang diizinkan.';
                errorOutput.classList.remove('hidden');
                fileInput.value = '';
                return;
            }

            uploading = true;
            fileInput.disabled = true;
            pdfUrlInput.disabled = true;
            uploadedOutput.textContent = 'Mengunggah PDF...';
            uploadedOutput.classList.remove('hidden');
            const progress = document.getElementById('initiative-pdf-upload-progress');
            progress.value = 0;
            progress.classList.remove('hidden');
            try {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
                const response = await new Promise((resolve, reject) => {
                    const request = new XMLHttpRequest();
                    request.open('POST', @json(route('api.media.upload', [], false)));
                    request.timeout = 600000;
                    request.setRequestHeader('Accept', 'application/json');
                    request.setRequestHeader('X-CSRF-TOKEN', csrfToken);
                    request.upload.addEventListener('progress', (event) => {
                        if (!event.lengthComputable) return;
                        const percentage = Math.round((event.loaded / event.total) * 100);
                        progress.value = percentage;
                        uploadedOutput.textContent = percentage >= 100
                            ? 'File terkirim, menunggu server menyimpan...'
                            : `Mengunggah PDF... ${percentage}%`;
                    });
                    request.addEventListener('load', () => resolve({
                        ok: request.status >= 200 && request.status < 300,
                        json: async () => JSON.parse(request.responseText),
                    }));
                    request.addEventListener('error', () => reject(new Error('Koneksi gagal saat mengunggah PDF.')));
                    request.addEventListener('abort', () => reject(new Error('Unggahan PDF dibatalkan.')));
                    request.addEventListener('timeout', () => reject(new Error('Server belum menyelesaikan penyimpanan PDF setelah 10 menit. Coba lagi atau gunakan URL PDF / Google Drive.')));
                    request.send(uploadData);
                });
                const result = await response.json();
                if (!response.ok || !result.success || result.data?.type !== 'DOCUMENT') {
                    throw new Error(result.error ?? 'Gagal mengunggah PDF.');
                }

                mediaIdInput.value = result.data.id;
                uploadedOutput.textContent = `${result.data.filename} siap dilampirkan.`;
            } catch (error) {
                errorOutput.textContent = error instanceof Error ? error.message : 'Gagal mengunggah PDF.';
                errorOutput.classList.remove('hidden');
                uploadedOutput.classList.add('hidden');
                submitAfterUpload = false;
                submitButton.disabled = false;
                submitButton.textContent = 'Simpan';
            } finally {
                uploading = false;
                fileInput.disabled = false;
                pdfUrlInput.disabled = false;
                fileInput.value = '';
                progress.classList.add('hidden');
                if (submitAfterUpload) {
                    submitAfterUpload = false;
                    if (!errorOutput.classList.contains('hidden')) return;
                    submitButton.disabled = false;
                    allowSubmit = true;
                    form.requestSubmit();
                }
            }
        });

        pdfUrlInput.addEventListener('input', () => {
            if (!pdfUrlInput.value) return;
            mediaIdInput.value = '';
            fileInput.value = '';
            uploadedOutput.classList.add('hidden');
            errorOutput.textContent = '';
            errorOutput.classList.add('hidden');
        });

        form.addEventListener('submit', (event) => {
            if (allowSubmit) {
                allowSubmit = false;
                return;
            }
            if (!uploading) return;

            event.preventDefault();
            submitAfterUpload = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Menunggu unggahan...';
        });
    })();
</script>