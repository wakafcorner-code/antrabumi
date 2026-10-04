<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HeroSettingsUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        foreach (['slides', 'config'] as $field) {
            $value = $this->input($field);
            if (! is_string($value)) {
                continue;
            }

            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge([$field => $decoded]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'slides' => ['required', 'array', 'min:1'],
            'slides.*.id' => ['required', 'string'],
            'slides.*.tagline' => ['sometimes', 'nullable', 'string'],
            'slides.*.taglineEn' => ['sometimes', 'nullable', 'string'],
            'slides.*.title' => ['required', 'string', 'min:1'],
            'slides.*.titleEn' => ['sometimes', 'nullable', 'string'],
            'slides.*.subtitle' => ['sometimes', 'nullable', 'string'],
            'slides.*.subtitleEn' => ['sometimes', 'nullable', 'string'],
            'slides.*.primaryCtaText' => ['sometimes', 'nullable', 'string'],
            'slides.*.primaryCtaTextEn' => ['sometimes', 'nullable', 'string'],
            'slides.*.primaryCtaLink' => ['sometimes', 'nullable', 'string'],
            'slides.*.secondaryCtaText' => ['sometimes', 'nullable', 'string'],
            'slides.*.secondaryCtaTextEn' => ['sometimes', 'nullable', 'string'],
            'slides.*.secondaryCtaLink' => ['sometimes', 'nullable', 'string'],
            'slides.*.imageUrl' => ['sometimes', 'nullable', 'string'],
            'slides.*.order' => ['sometimes', 'nullable', 'integer'],
            'slides.*.isActive' => ['sometimes', 'boolean'],
            'config' => ['required', 'array'],
            'config.autoplay' => ['required', 'boolean'],
            'config.intervalMs' => ['required', 'integer', 'min:2000', 'max:30000'],
            'config.transitionEffect' => ['required', 'in:fade,slide'],
            'config.pauseOnHover' => ['required', 'boolean'],
        ];
    }
}