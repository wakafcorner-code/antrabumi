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
            'file' => ['required', 'file', 'max:15360', 'mimes:jpg,jpeg,png,webp,gif,pdf', 'extensions:jpg,jpeg,png,webp,gif,pdf', 'mimetypes:image/jpeg,image/png,image/webp,image/gif,application/pdf'],
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
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $file = $this->file('file');
            if (! $file || ! $file->isValid()) {
                return;
            }

            $mimeType = $file->getMimeType();
            if ($mimeType === 'application/pdf') {
                $signature = file_get_contents($file->getRealPath(), false, null, 0, 5);
                if ($signature !== '%PDF-') {
                    $validator->errors()->add('file', 'File PDF tidak memiliki signature yang valid.');
                }

                return;
            }

            $image = @getimagesize($file->getRealPath());
            if (! $image || $image['mime'] !== $mimeType) {
                $validator->errors()->add('file', 'File gambar tidak valid.');
            }
        });
    }
}
