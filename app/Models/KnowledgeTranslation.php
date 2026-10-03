<?php

namespace App\Models;

use App\Enums\Language;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeTranslation extends BaseModel
{
    protected $table = 'KnowledgeTranslation';
    protected $fillable = ['knowledgeId', 'language', 'title', 'excerpt', 'content', 'seoTitle', 'seoDescription'];
    protected function casts(): array { return ['language' => Language::class]; }
    public function knowledge(): BelongsTo { return $this->belongsTo(Knowledge::class, 'knowledgeId'); }
}
