<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ExperienceMedia extends Pivot
{
    protected $table = 'ExperienceMedia';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['experienceId', 'mediaId', 'order'];
    public function experience(): BelongsTo { return $this->belongsTo(Experience::class, 'experienceId'); }
    public function media(): BelongsTo { return $this->belongsTo(Media::class, 'mediaId'); }
}
