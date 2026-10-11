<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Validator;

class MediaUploadRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:15360'],
            'altText' => ['nullable', 'string', 'max:300'],
            'caption' => ['nullable', 'string', 'max:1000'],
            'attribution' => ['nullable', 'string', 'max:300'],
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'error' => $validator->errors()->first(),
        ], 400));
    }

    public function messages(): array
    {
        return [
            'file.required' => 'File tidak ditemukan dalam form upload.',
            'file.max' => 'Ukuran berkas melebihi batas maksimum 15MB.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $file = $this->file('file');
            if (! $file || ! $file->isValid()) {
                return;
            }

            $extension = strtolower($file->getClientOriginalExtension());
            $mimeType = $file->getMimeType();
            if ($extension === 'mp4') {
                $header = file_get_contents($file->getRealPath(), false, null, 0, 12);
                $boxSize = is_string($header) && strlen($header) === 12 ? unpack('Nsize', substr($header, 0, 4))['size'] : 0;
                if (! is_string($header) || substr($header, 4, 4) !== 'ftyp' || $boxSize < 16 || $boxSize > $file->getSize()) {
                    $validator->errors()->add('file', 'File video MP4 tidak memiliki signature yang valid.');
                }

                return;
            }

            if ($extension === 'pdf' && $mimeType === 'application/pdf') {
                $signature = file_get_contents($file->getRealPath(), false, null, 0, 5);
                if ($signature !== '%PDF-') {
                    $validator->errors()->add('file', 'File PDF tidak memiliki signature yang valid.');
                }

                return;
            }

            $expectedImageMime = match ($extension) {
                'jpg', 'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                'gif' => 'image/gif',
                default => null,
            };
            if ($expectedImageMime === null) {
                $validator->errors()->add('file', 'Format berkas tidak didukung.');
                return;
            }

            $image = @getimagesize($file->getRealPath());
            if (! $image || $image['mime'] !== $expectedImageMime || $mimeType !== $expectedImageMime) {
                $validator->errors()->add('file', 'File gambar tidak valid.');
            }
        });
    }
}
