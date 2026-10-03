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
            @error('pdfLabel')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>
    </div>
    <p id="knowledge-pdf-upload-error" class="hidden text-xs text-red-700" role="alert"></p>
    <p id="knowledge-pdf-uploaded-file" class="hidden text-xs text-emerald-700" role="status"></p>
    <p class="text-xs text-neutral-500">PDF maks. 15 MB. Pilih file lalu simpan untuk mengunggah dan melampirkannya.</p>
</div>
