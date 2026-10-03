<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return ['email' => ['required', 'string', 'email', 'max:191'], 'password' => ['required', 'string']];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Invalid email format.',
            'password.required' => 'Password is required.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        if ($this->expectsJson()) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'error' => 'Invalid email or password.',
                'details' => $validator->errors()->toArray(),
            ], 400));
        }

        parent::failedValidation($validator);
    }
}
