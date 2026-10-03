<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class KnowledgeCategory extends Pivot
{
    protected $table = 'KnowledgeCategory';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['knowledgeId', 'categoryId'];
    public function knowledge(): BelongsTo { return $this->belongsTo(Knowledge::class, 'knowledgeId'); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class, 'categoryId'); }
}
