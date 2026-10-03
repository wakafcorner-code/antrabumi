<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeDownload extends BaseModel
{
    protected $table = 'KnowledgeDownload';
    protected $fillable = ['knowledgeId', 'mediaId', 'label', 'order'];
    public $timestamps = false;

    public function knowledge(): BelongsTo { return $this->belongsTo(Knowledge::class, 'knowledgeId'); }
    public function media(): BelongsTo { return $this->belongsTo(Media::class, 'mediaId'); }
}
