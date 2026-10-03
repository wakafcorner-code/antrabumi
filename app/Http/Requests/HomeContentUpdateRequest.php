<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HomeContentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $value = $this->input('content');
        if (! is_string($value)) {
            return;
        }

        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $this->merge(['content' => $decoded]);
        }
    }

    public function rules(): array
    {
        return ['content' => ['required', 'array']];
    }
}