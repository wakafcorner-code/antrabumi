<?php

namespace App\Models;

use App\Enums\Language;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NavigationItem extends BaseModel
{
    protected $table = 'NavigationItem';
    protected $fillable = ['label', 'url', 'language', 'parentId', 'order', 'visible', 'openInNewTab'];
    protected function casts(): array { return ['language' => Language::class, 'visible' => 'boolean', 'openInNewTab' => 'boolean']; }
    public function parent(): BelongsTo { return $this->belongsTo(self::class, 'parentId'); }
    public function children(): HasMany { return $this->hasMany(self::class, 'parentId')->orderBy('order'); }
}
