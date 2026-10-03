<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ExperienceKnowledge extends Pivot
{
    protected $table = 'ExperienceKnowledge';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['experienceId', 'knowledgeId'];
    public function experience(): BelongsTo { return $this->belongsTo(Experience::class, 'experienceId'); }
    public function knowledge(): BelongsTo { return $this->belongsTo(Knowledge::class, 'knowledgeId'); }
}
