<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait UsesStringPrimaryKey
{
    public function getIncrementing(): bool
    {
        return false;
    }

    public function getKeyType(): string
    {
        return 'string';
    }

    protected static function bootUsesStringPrimaryKey(): void
    {
        static::creating(function (Model $model): void {
            if (! $model->getKey()) {
                $model->setAttribute($model->getKeyName(), (string) Str::ulid());
            }
        });
    }
}
