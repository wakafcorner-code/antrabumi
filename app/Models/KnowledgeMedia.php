<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class KnowledgeMedia extends Pivot
{
    protected $table = 'KnowledgeMedia';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['knowledgeId', 'mediaId', 'order'];
    public function knowledge(): BelongsTo { return $this->belongsTo(Knowledge::class, 'knowledgeId'); }
    public function media(): BelongsTo { return $this->belongsTo(Media::class, 'mediaId'); }
}
