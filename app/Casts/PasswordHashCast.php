<?php

namespace App\Casts;

use App\Auth\LegacyBcryptHash;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class PasswordHashCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return $value;
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        if (LegacyBcryptHash::isSourceFormat($value) || Hash::isHashed($value)) {
            return $value;
        }

        return Hash::make($value);
    }
}