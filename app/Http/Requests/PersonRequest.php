<?php

namespace App\Http\Requests;

use App\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PersonRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    protected function prepareForValidation(): void
    {
        if (! $this->isMethod('post') || $this->filled('slug') || ! is_string($this->input('nameId'))) {
            return;
        }

        $this->merge(['slug' => Str::slug($this->input('nameId'))]);
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'min:2', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('Person', 'slug')->ignore($this->route('person'), 'id')],
            'imageId' => ['nullable', 'string', 'exists:Media,id'],
            'imageIdUrl' => ['nullable', 'string', 'max:191', 'url', function (string $attribute, mixed $value, \Closure $fail): void {
                if (! in_array(strtolower((string) parse_url($value, PHP_URL_SCHEME)), ['http', 'https'], true)) {
                    $fail('URL foto harus menggunakan HTTP atau HTTPS.');
                }
            }],
            'order' => ['sometimes', 'integer', 'min:0'],
            'nameId' => ['required', 'string', 'min:2', 'max:200'],
            'degreeId' => ['nullable', 'string', 'max:191'],
            'roleId' => ['nullable', 'string', 'max:191'],
            'biographyId' => ['nullable', 'string'],
            'nameEn' => ['nullable', 'string', 'max:200'],
            'degreeEn' => ['nullable', 'string', 'max:191'],
            'roleEn' => ['nullable', 'string', 'max:191'],
            'biographyEn' => ['nullable', 'string'],
        ];
    }
}
