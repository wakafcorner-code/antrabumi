<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactMessageRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email', 'max:191'],
            'phone' => ['nullable', 'string', 'max:50'],
            'organization' => ['nullable', 'string', 'max:150'],
            'areaOfInterest' => ['nullable', 'string', 'max:150'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string', 'min:5', 'max:5000'],
        ];
    }
}
