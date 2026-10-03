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
            'slides' => ['required', 'array'],
            'slides.*.id' => ['required', 'string'],
            'slides.*.tagline' => ['sometimes', 'string'],
            'slides.*.taglineEn' => ['sometimes', 'string'],
            'slides.*.title' => ['required', 'string', 'min:1'],
            'slides.*.titleEn' => ['sometimes', 'string'],
            'slides.*.subtitle' => ['sometimes', 'string'],
            'slides.*.subtitleEn' => ['sometimes', 'string'],
            'slides.*.primaryCtaText' => ['sometimes', 'string'],
            'slides.*.primaryCtaTextEn' => ['sometimes', 'string'],
            'slides.*.primaryCtaLink' => ['sometimes', 'string'],
            'slides.*.secondaryCtaText' => ['sometimes', 'string'],
            'slides.*.secondaryCtaTextEn' => ['sometimes', 'string'],
            'slides.*.secondaryCtaLink' => ['sometimes', 'string'],
            'slides.*.imageUrl' => ['sometimes', 'string'],
            'slides.*.order' => ['sometimes', 'integer'],
            'slides.*.isActive' => ['sometimes', 'boolean'],
            'config' => ['required', 'array'],
            'config.autoplay' => ['required', 'boolean'],
            'config.intervalMs' => ['required', 'integer', 'min:2000', 'max:30000'],
            'config.transitionEffect' => ['required', 'in:fade,slide'],
            'config.pauseOnHover' => ['required', 'boolean'],
        ];
    }
}