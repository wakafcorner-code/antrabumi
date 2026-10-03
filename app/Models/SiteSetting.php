<?php

namespace App\Models;

use App\Enums\Language;

class SiteSetting extends BaseModel
{
    protected $table = 'SiteSetting';
    protected $fillable = ['key', 'value', 'language', 'description'];
    protected function casts(): array { return ['language' => Language::class]; }
}
