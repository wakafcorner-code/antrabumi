<script>
    (() => {
        const form = document.currentScript.closest('form');
        const submitButton = form.querySelector('button[type="submit"]');
        const pdfUrlInput = document.getElementById('knowledge-pdf-url');
        let allowSubmit = false;
        let submitAfterUpload = false;

        const uploaders = [
            {
                fileInput: document.getElementById('knowledge-pdf-file'),
                mediaIdInput: document.getElementById('knowledge-pdf-media-id'),
                errorOutput: document.getElementById('knowledge-pdf-upload-error'),
                expectedType: 'DOCUMENT',
                needsUpload: false,
                uploading: false,
                onUpload: (media) => {
                    const uploadedOutput = document.getElementById('knowledge-pdf-uploaded-file');
                    uploadedOutput.textContent = `${media.filename} siap dilampirkan saat disimpan.`;
                    uploadedOutput.classList.remove('hidden');
                },
            },
            {
                fileInput: document.getElementById('knowledge-cover-file'),
                mediaIdInput: document.getElementById('knowledge-cover-media-id'),
                errorOutput: document.getElementById('knowledge-cover-error'),
                expectedType: null,
                needsUpload: false,
                uploading: false,
                onUpload: (media) => {
                    const preview = document.getElementById('knowledge-cover-preview');
                    document.getElementById('knowledge-cover-link').href = media.url;
                    document.getElementById('knowledge-cover-name').textContent = media.filename;
                    preview.classList.remove('hidden');
                    preview.classList.add('flex');
                },
            },
        ];

        const uploadFile = async (uploader, file) => {
            uploader.uploading = true;
            uploader.fileInput.disabled = true;
            if (uploader.expectedType === 'DOCUMENT') pdfUrlInput.disabled = true;
            const progress = uploader.expectedType === 'DOCUMENT'
                ? document.getElementById('knowledge-pdf-upload-progress')
                : null;
            if (uploader.expectedType === 'DOCUMENT') {
                const uploadedOutput = document.getElementById('knowledge-pdf-uploaded-file');
                uploadedOutput.textContent = 'Mengunggah PDF...';
                uploadedOutput.classList.remove('hidden');
                progress.value = 0;
                progress.classList.remove('hidden');
            }

            try {
                if (file.size > 15 * 1024 * 1024) {
                    throw new Error('Ukuran berkas melebihi batas maksimum 15MB.');
                }
                if (uploader.expectedType === 'DOCUMENT' && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                    throw new Error('Hanya berkas format PDF yang diizinkan.');
                }

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
                        if (!progress || !event.lengthComputable) return;
                        const percentage = Math.round((event.loaded / event.total) * 100);
                        progress.value = percentage;
                        document.getElementById('knowledge-pdf-uploaded-file').textContent = percentage >= 100
                            ? 'File terkirim, menunggu server menyimpan...'
                            : `Mengunggah PDF... ${percentage}%`;
                    });
                    request.addEventListener('load', () => resolve({
                        ok: request.status >= 200 && request.status < 300,
                        json: async () => JSON.parse(request.responseText),
                    }));
                    request.addEventListener('error', () => reject(new Error('Koneksi gagal saat mengunggah berkas.')));
                    request.addEventListener('abort', () => reject(new Error('Unggahan berkas dibatalkan.')));
                    request.addEventListener('timeout', () => reject(new Error('Server belum menyelesaikan penyimpanan PDF setelah 10 menit. Coba lagi atau gunakan URL PDF / Google Drive.')));
                    request.send(uploadData);
                });
                const result = await response.json();
                if (!response.ok || !result.success || (uploader.expectedType && result.data?.type !== uploader.expectedType)) {
                    throw new Error(result.error ?? 'Gagal mengunggah berkas.');
                }

                uploader.mediaIdInput.value = result.data.id;
                uploader.needsUpload = false;
                uploader.onUpload(result.data);
            } catch (error) {
                uploader.needsUpload = false;
                uploader.errorOutput.textContent = error instanceof Error ? error.message : 'Gagal mengunggah berkas.';
                uploader.errorOutput.classList.remove('hidden');
                if (uploader.expectedType === 'DOCUMENT') {
                    document.getElementById('knowledge-pdf-uploaded-file').classList.add('hidden');
                }
                submitAfterUpload = false;
                submitButton.disabled = false;
                submitButton.textContent = 'Simpan';
            } finally {
                uploader.uploading = false;
                uploader.fileInput.disabled = false;
                if (uploader.expectedType === 'DOCUMENT') pdfUrlInput.disabled = false;
                uploader.fileInput.value = '';
                progress?.classList.add('hidden');
                if (submitAfterUpload && uploaders.every((item) => !item.uploading && !item.needsUpload)) {
                    submitAfterUpload = false;
                    submitButton.disabled = false;
                    if (uploaders.every((item) => item.errorOutput.classList.contains('hidden'))) {
                        allowSubmit = true;
                        form.requestSubmit();
                    } else {
                        submitButton.textContent = 'Simpan';
                    }
                }
            }
        };

        for (const uploader of uploaders) {
            uploader.fileInput.addEventListener('change', () => {
                const file = uploader.fileInput.files?.[0];
                if (uploader.expectedType === 'DOCUMENT' && file) {
                    document.getElementById('knowledge-pdf-url').value = '';
                    uploader.mediaIdInput.value = '';
                }
                uploader.needsUpload = Boolean(file);
                uploader.errorOutput.textContent = '';
                uploader.errorOutput.classList.add('hidden');
                if (file) uploadFile(uploader, file);
            });
        }

        const pdfUploader = uploaders[0];
        pdfUrlInput.addEventListener('input', () => {
            if (!pdfUrlInput.value) return;
            pdfUploader.mediaIdInput.value = '';
            pdfUploader.fileInput.value = '';
            document.getElementById('knowledge-pdf-uploaded-file').classList.add('hidden');
            pdfUploader.errorOutput.textContent = '';
            pdfUploader.errorOutput.classList.add('hidden');
        });

        document.getElementById('knowledge-cover-clear').addEventListener('click', () => {
            const coverUploader = uploaders[1];
            coverUploader.mediaIdInput.value = '';
            coverUploader.fileInput.value = '';
            coverUploader.needsUpload = false;
            document.getElementById('knowledge-cover-preview').classList.add('hidden');
        });

        form.addEventListener('submit', (event) => {
            if (allowSubmit) {
                allowSubmit = false;
                return;
            }

            if (!uploaders.some((uploader) => uploader.uploading || uploader.needsUpload)) return;
            event.preventDefault();
            submitAfterUpload = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Menunggu unggahan...';
        });
    })();
</script>