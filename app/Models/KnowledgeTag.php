<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class KnowledgeTag extends Pivot
{
    protected $table = 'KnowledgeTag';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['knowledgeId', 'tagId'];
    public function knowledge(): BelongsTo { return $this->belongsTo(Knowledge::class, 'knowledgeId'); }
    public function tag(): BelongsTo { return $this->belongsTo(Tag::class, 'tagId'); }
}
