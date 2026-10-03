<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExperienceMetric extends BaseModel
{
    protected $table = 'ExperienceMetric';
    protected $fillable = ['experienceId', 'label', 'value', 'unit', 'order'];
    public $timestamps = false;
    public function experience(): BelongsTo { return $this->belongsTo(Experience::class, 'experienceId'); }
}
