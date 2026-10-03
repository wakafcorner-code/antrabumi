<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ExperienceContributionArea extends Pivot
{
    protected $table = 'ExperienceContributionArea';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['experienceId', 'contributionAreaId'];
    public function experience(): BelongsTo { return $this->belongsTo(Experience::class, 'experienceId'); }
    public function contributionArea(): BelongsTo { return $this->belongsTo(ContributionArea::class, 'contributionAreaId'); }
}
