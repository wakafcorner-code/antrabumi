<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class KnowledgeContributionArea extends Pivot
{
    protected $table = 'KnowledgeContributionArea';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['knowledgeId', 'contributionAreaId'];
    public function knowledge(): BelongsTo { return $this->belongsTo(Knowledge::class, 'knowledgeId'); }
    public function contributionArea(): BelongsTo { return $this->belongsTo(ContributionArea::class, 'contributionAreaId'); }
}
