<?php

namespace App\Http\Requests;

use App\Enums\ContentStatus;
use App\Enums\KnowledgeType;
use App\Enums\MediaType;
use App\Services\ExternalPdfReference;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KnowledgeRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('featured'))) {
            $featured = strtolower($this->input('featured'));
            if (in_array($featured, ['true', 'on', '1'], true)) {
                $this->merge(['featured' => true]);
            } elseif (in_array($featured, ['false', 'off', '0'], true)) {
                $this->merge(['featured' => false]);
            }
        }

        if ($this->exists('bodyId') && ! $this->exists('contentId')) {
            $this->merge(['contentId' => $this->input('bodyId')]);
        }
        if ($this->exists('bodyEn') && ! $this->exists('contentEn')) {
            $this->merge(['contentEn' => $this->input('bodyEn')]);
        }

        if (! $this->isMethod('post') || filled($this->input('slug')) || ! is_string($this->input('titleId'))) {
            return;
        }

        $slug = strtolower(trim($this->input('titleId')));
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug) ?? '';
        $slug = preg_replace('/\s+/', '-', $slug) ?? '';
        $slug = preg_replace('/-+/', '-', $slug) ?? '';

        $this->merge(['slug' => $slug]);
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'min:2', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('Knowledge', 'slug')->ignore($this->route('knowledge'), 'id')],
            'type' => ['required', Rule::enum(KnowledgeType::class)],
            'status' => ['sometimes', Rule::enum(ContentStatus::class)],
            'featured' => ['sometimes', 'boolean'],
            'authorName' => ['nullable', 'string', 'max:150'],
            'publicationDate' => ['nullable', 'date'],
            'coverMediaId' => ['nullable', 'string', Rule::exists('Media', 'id')->where('type', MediaType::IMAGE->value)],
            'pdfMediaId' => ['sometimes', 'nullable', 'string', Rule::exists('Media', 'id')->where('type', MediaType::DOCUMENT->value)->where('mimeType', 'application/pdf')],
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
            'pdfLabel' => ['nullable', 'string', 'max:191'],
            'galleryMediaIds' => ['sometimes', 'array'],
            'galleryMediaIds.*' => ['required', 'string', Rule::exists('Media', 'id')->where('type', MediaType::IMAGE->value)],
            'titleId' => ['required', 'string', 'min:2', 'max:300'],
            'excerptId' => ['nullable', 'string', 'max:1000'],
            'contentId' => ['nullable', 'string'],
            'titleEn' => ['nullable', 'string', 'max:300'],
            'excerptEn' => ['nullable', 'string', 'max:1000'],
            'contentEn' => ['nullable', 'string'],
        ];
    }
}
