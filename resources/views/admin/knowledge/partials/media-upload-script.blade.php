<script>
    (() => {
        const form = document.currentScript.closest('form');
        const submitButton = form.querySelector('button[type="submit"]');
        let allowSubmit = false;

        const uploaders = [
            {
                fileInput: document.getElementById('knowledge-pdf-file'),
                mediaIdInput: document.getElementById('knowledge-pdf-media-id'),
                errorOutput: document.getElementById('knowledge-pdf-upload-error'),
                expectedType: 'DOCUMENT',
                needsUpload: false,
                onUpload: (media) => {
                    document.getElementById('knowledge-pdf-uploaded-file').textContent = `${media.filename} siap dilampirkan saat disimpan.`;
                    document.getElementById('knowledge-pdf-uploaded-file').classList.remove('hidden');
                },
            },
            {
                fileInput: document.getElementById('knowledge-cover-file'),
                mediaIdInput: document.getElementById('knowledge-cover-media-id'),
                errorOutput: document.getElementById('knowledge-cover-error'),
                expectedType: null,
                needsUpload: false,
                onUpload: (media) => {
                    const preview = document.getElementById('knowledge-cover-preview');
                    document.getElementById('knowledge-cover-link').href = media.url;
                    document.getElementById('knowledge-cover-name').textContent = media.filename;
                    preview.classList.remove('hidden');
                    preview.classList.add('flex');
                },
            },
        ];

        for (const uploader of uploaders) {
            uploader.fileInput.addEventListener('change', () => {
                uploader.needsUpload = Boolean(uploader.fileInput.files?.[0]);
                uploader.errorOutput.textContent = '';
                uploader.errorOutput.classList.add('hidden');
            });
        }

        document.getElementById('knowledge-cover-clear').addEventListener('click', () => {
            const coverUploader = uploaders[1];
            coverUploader.mediaIdInput.value = '';
            coverUploader.fileInput.value = '';
            coverUploader.needsUpload = false;
            document.getElementById('knowledge-cover-preview').classList.add('hidden');
        });

        form.addEventListener('submit', async (event) => {
            if (allowSubmit) {
                allowSubmit = false;
                return;
            }

            const pendingUploads = uploaders.filter((uploader) => uploader.needsUpload && uploader.fileInput.files?.[0]);
            if (pendingUploads.length === 0) return;

            event.preventDefault();
            const defaultButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Mengunggah berkas...';
            for (const uploader of uploaders) uploader.fileInput.disabled = true;

            let activeUploader = pendingUploads[0];
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';

                for (const uploader of pendingUploads) {
                    activeUploader = uploader;
                    const file = uploader.fileInput.files[0];
                    if (file.size > 15 * 1024 * 1024) {
                        throw new Error('Ukuran berkas melebihi batas maksimum 15MB.');
                    }
                    if (uploader.expectedType === 'DOCUMENT' && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                        throw new Error('Hanya berkas format PDF yang diizinkan.');
                    }

                    const uploadData = new FormData();
                    uploadData.append('file', file);
                    const response = await fetch(@json(route('api.media.upload')), {
                        method: 'POST',
                        headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                        body: uploadData,
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success || (uploader.expectedType && result.data?.type !== uploader.expectedType)) {
                        throw new Error(result.error ?? 'Gagal mengunggah berkas.');
                    }

                    uploader.mediaIdInput.value = result.data.id;
                    uploader.needsUpload = false;
                    uploader.onUpload(result.data);
                }

                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
                for (const uploader of uploaders) uploader.fileInput.disabled = false;
                allowSubmit = true;
                form.requestSubmit();
            } catch (error) {
                activeUploader.errorOutput.textContent = error instanceof Error ? error.message : 'Gagal mengunggah berkas.';
                activeUploader.errorOutput.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
                for (const uploader of uploaders) uploader.fileInput.disabled = false;
            }
        });
    })();
</script>