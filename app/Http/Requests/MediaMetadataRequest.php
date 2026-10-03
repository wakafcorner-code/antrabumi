<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MediaMetadataRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }
    public function rules(): array
    {
        return [
            'altText' => ['nullable', 'string', 'max:300'],
            'caption' => ['nullable', 'string', 'max:1000'],
            'attribution' => ['nullable', 'string', 'max:300'],
        ];
    }
}
