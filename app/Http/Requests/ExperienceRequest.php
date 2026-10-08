<?php

namespace App\Http\Requests;

use App\Enums\ContentStatus;
use App\Enums\MediaType;
use App\Services\ExternalPdfReference;
use Illuminate\Support\Str;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExperienceRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    protected function prepareForValidation(): void
    {
        if (! $this->route('experience') && ! $this->route('initiative') && ! $this->filled('slug') && $this->filled('titleId')) {
            $this->merge(['slug' => Str::slug($this->input('titleId'))]);
        }
    }

    public function rules(): array
    {
        $experience = $this->route('experience') ?? $this->route('initiative');

        return [
            'slug' => ['required', 'string', 'min:2', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('Experience', 'slug')->ignore($experience, 'id')],
            'type' => ['sometimes', 'in:EXPERIENCE,INITIATIVE'],
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'category' => ['nullable', 'string', 'max:120'],
            'location' => ['nullable', 'string', 'max:191'],
            'clientName' => ['nullable', 'string', 'max:191'],
            'client' => ['nullable', 'string', 'max:191'],
            'status' => ['sometimes', Rule::enum(ContentStatus::class)],
            'featured' => ['sometimes', 'boolean'],
            'coverMediaId' => ['nullable', 'string', Rule::exists('Media', 'id')->where('type', MediaType::IMAGE->value)],
            'pdfMediaId' => ['nullable', 'string', Rule::exists('Media', 'id')->where('type', MediaType::DOCUMENT->value)->where('mimeType', 'application/pdf')],
            'pdfUrl' => ['nullable', 'string', 'max:191', function (string $attribute, mixed $value, \Closure $fail): void {
                if (! filled($value)) {
                    return;
                }
                if (filled($this->input('pdfMediaId'))) {
                    $fail('Pilih unggah file PDF atau URL PDF, jangan keduanya.');
                } elseif (! ExternalPdfReference::supports($value)) {
                    $fail('Masukkan URL HTTPS menuju PDF atau file Google Drive yang dapat diakses publik.');
                }
            }],
            'galleryMediaIds' => ['sometimes', 'array'],
            'galleryMediaIds.*' => ['required', 'string', Rule::exists('Media', 'id')->where('type', MediaType::IMAGE->value)],
            'titleId' => ['required', 'string', 'min:2', 'max:191'],
            'excerptId' => ['nullable', 'string', 'max:500'],
            'descriptionId' => ['nullable', 'string'],
            'bodyId' => ['nullable', 'string'],
            'titleEn' => ['nullable', 'string', 'max:191'],
            'excerptEn' => ['nullable', 'string', 'max:500'],
            'descriptionEn' => ['nullable', 'string'],
            'bodyEn' => ['nullable', 'string'],
        ];
    }
}
