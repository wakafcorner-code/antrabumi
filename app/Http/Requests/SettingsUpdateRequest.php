<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingsUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $input = $this->all();
        unset($input['_token'], $input['_method']);

        $rules = [];
        foreach (array_keys($input) as $key) {
            $rules[$key] = ['string', 'max:5000'];
        }

        return $rules;
    }
}