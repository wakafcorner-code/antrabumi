<?php

namespace App\Models;

use App\Enums\Language;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonTranslation extends BaseModel
{
    protected $table = 'PersonTranslation';
    protected $fillable = ['personId', 'language', 'name', 'degree', 'role', 'biography'];
    protected function casts(): array { return ['language' => Language::class]; }
    public function person(): BelongsTo { return $this->belongsTo(Person::class, 'personId'); }
}
