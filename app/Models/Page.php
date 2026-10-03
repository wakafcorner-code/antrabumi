<?php

namespace App\Models;

use App\Enums\ContentStatus;
use App\Enums\Language;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Page extends BaseModel
{
    protected $table = 'Page';
    protected $fillable = ['slug', 'language', 'title', 'excerpt', 'content', 'heroTitle', 'heroDescription', 'heroMediaId', 'status', 'seoTitle', 'seoDescription', 'ogImageId', 'publishedAt'];
    protected function casts(): array { return ['language' => Language::class, 'status' => ContentStatus::class, 'publishedAt' => 'datetime']; }
    public function heroMedia(): BelongsTo { return $this->belongsTo(Media::class, 'heroMediaId'); }
    public function ogImage(): BelongsTo { return $this->belongsTo(Media::class, 'ogImageId'); }
}
