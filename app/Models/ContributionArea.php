<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContributionArea extends BaseModel
{
    protected $table = 'ContributionArea';
    protected $fillable = ['slug', 'status', 'order'];
    protected function casts(): array { return ['status' => ContentStatus::class]; }
    public function translations(): HasMany { return $this->hasMany(ContributionAreaTranslation::class, 'contributionAreaId'); }
    public function experiences(): BelongsToMany { return $this->belongsToMany(Experience::class, 'ExperienceContributionArea', 'contributionAreaId', 'experienceId'); }
    public function knowledge(): BelongsToMany { return $this->belongsToMany(Knowledge::class, 'KnowledgeContributionArea', 'contributionAreaId', 'knowledgeId'); }
}
