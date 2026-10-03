<?php

namespace App\Http\Requests;

use App\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PartnerRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    protected function prepareForValidation(): void
    {
        if (! $this->isMethod('post') || filled($this->input('slug'))) {
            return;
        }

        $slug = strtolower(trim((string) $this->input('name')));
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug) ?? '';
        $slug = preg_replace('/\s+/', '-', $slug) ?? '';
        $slug = preg_replace('/-+/', '-', $slug) ?? '';

        $this->merge(['slug' => $slug]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:191'],
            'slug' => ['required', 'string', 'min:2', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('Partner', 'slug')->ignore($this->route('partner'), 'id')],
            'description' => ['nullable', 'string'],
            'logoMediaId' => ['nullable', 'string', 'exists:Media,id'],
            'logoMediaIdUrl' => ['nullable', 'string', 'max:191', 'url', function (string $attribute, mixed $value, \Closure $fail): void {
                if (! in_array(strtolower((string) parse_url($value, PHP_URL_SCHEME)), ['http', 'https'], true)) {
                    $fail('URL logo harus menggunakan HTTP atau HTTPS.');
                }
            }],
            'website' => ['nullable', 'url', 'max:191'],
            'category' => ['nullable', 'string', 'max:191'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
