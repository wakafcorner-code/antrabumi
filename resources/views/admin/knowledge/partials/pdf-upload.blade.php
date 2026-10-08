<input type="hidden" name="pdfMediaId" id="knowledge-pdf-media-id" value="{{ old('pdfMediaId') }}">

<div class="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
    <h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-800">Upload PDF</h2>
    <div class="grid gap-3 md:grid-cols-2">
        <div>
            <label for="knowledge-pdf-file" class="mb-1 block text-xs font-medium text-neutral-700">File PDF</label>
            <input id="knowledge-pdf-file" type="file" accept="application/pdf,.pdf" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
        </div>
        <div>
            <label for="knowledge-pdf-label" class="mb-1 block text-xs font-medium text-neutral-700">Label PDF (opsional)</label>
            <input id="knowledge-pdf-label" name="pdfLabel" maxlength="191" value="{{ old('pdfLabel') }}" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
            @error('pdfMediaId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            @error('pdfUrl')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            @error('pdfLabel')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>
    </div>
    <div>
        <label for="knowledge-pdf-url" class="mb-1 block text-xs font-medium text-neutral-700">Atau URL PDF / Google Drive</label>
        <input id="knowledge-pdf-url" name="pdfUrl" type="url" maxlength="191" value="{{ old('pdfUrl') }}" placeholder="https://drive.google.com/file/d/... atau https://contoh.org/dokumen.pdf" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
        <p class="mt-1 text-xs text-neutral-500">Pastikan akses Google Drive diatur ke “Siapa saja yang memiliki link”. URL harus memakai HTTPS.</p>
    </div>
    <p id="knowledge-pdf-upload-error" class="hidden text-xs text-red-700" role="alert"></p>
    <p id="knowledge-pdf-uploaded-file" class="hidden text-xs text-emerald-700" role="status"></p>
    <progress id="knowledge-pdf-upload-progress" max="100" value="0" class="hidden h-2 w-full accent-[#0D5C4D]" aria-label="Progres unggah PDF"></progress>
    <p class="text-xs text-neutral-500">PDF maks. 15 MB. Setelah memilih file, tunggu sampai status unggahan siap lalu klik Simpan.</p>
</div>
