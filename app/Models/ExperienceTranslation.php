<?php

namespace App\Models;

use App\Enums\Language;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExperienceTranslation extends BaseModel
{
    protected $table = 'ExperienceTranslation';
    protected $fillable = ['experienceId', 'language', 'title', 'excerpt', 'description', 'methodology', 'impact', 'seoTitle', 'seoDescription'];
    protected function casts(): array { return ['language' => Language::class]; }
    public function experience(): BelongsTo { return $this->belongsTo(Experience::class, 'experienceId'); }
}
