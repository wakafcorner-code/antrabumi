<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Experience extends BaseModel
{
    protected $table = 'Experience';
    protected $fillable = ['slug', 'type', 'year', 'category', 'location', 'clientName', 'status', 'featured', 'coverMediaId', 'createdById', 'updatedById', 'publishedAt'];
    protected function casts(): array { return ['status' => ContentStatus::class, 'featured' => 'boolean', 'publishedAt' => 'datetime']; }
    public function coverMedia(): BelongsTo { return $this->belongsTo(Media::class, 'coverMediaId'); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'createdById'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updatedById'); }
    public function translations(): HasMany { return $this->hasMany(ExperienceTranslation::class, 'experienceId'); }
    public function metrics(): HasMany { return $this->hasMany(ExperienceMetric::class, 'experienceId')->orderBy('order'); }
    public function contributionAreas(): BelongsToMany { return $this->belongsToMany(ContributionArea::class, 'ExperienceContributionArea', 'experienceId', 'contributionAreaId'); }
    public function media(): BelongsToMany { return $this->belongsToMany(Media::class, 'ExperienceMedia', 'experienceId', 'mediaId')->withPivot('order'); }
    public function knowledge(): BelongsToMany { return $this->belongsToMany(Knowledge::class, 'ExperienceKnowledge', 'experienceId', 'knowledgeId'); }
}
