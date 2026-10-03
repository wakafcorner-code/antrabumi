<?php

namespace App\Models;

use App\Enums\ContentStatus;
use App\Enums\KnowledgeType;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Knowledge extends BaseModel
{
    protected $table = 'Knowledge';
    protected $fillable = ['slug', 'type', 'coverMediaId', 'status', 'featured', 'authorName', 'publicationDate', 'createdById', 'updatedById', 'publishedAt'];
    protected function casts(): array { return ['type' => KnowledgeType::class, 'status' => ContentStatus::class, 'featured' => 'boolean', 'publicationDate' => 'datetime', 'publishedAt' => 'datetime']; }
    public function coverMedia(): BelongsTo { return $this->belongsTo(Media::class, 'coverMediaId'); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'createdById'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updatedById'); }
    public function translations(): HasMany { return $this->hasMany(KnowledgeTranslation::class, 'knowledgeId'); }
    public function categories(): BelongsToMany { return $this->belongsToMany(Category::class, 'KnowledgeCategory', 'knowledgeId', 'categoryId'); }
    public function tags(): BelongsToMany { return $this->belongsToMany(Tag::class, 'KnowledgeTag', 'knowledgeId', 'tagId'); }
    public function experiences(): BelongsToMany { return $this->belongsToMany(Experience::class, 'ExperienceKnowledge', 'knowledgeId', 'experienceId'); }
    public function contributionAreas(): BelongsToMany { return $this->belongsToMany(ContributionArea::class, 'KnowledgeContributionArea', 'knowledgeId', 'contributionAreaId'); }
    public function downloads(): HasMany { return $this->hasMany(KnowledgeDownload::class, 'knowledgeId')->orderBy('order'); }
    public function gallery(): BelongsToMany { return $this->belongsToMany(Media::class, 'KnowledgeMedia', 'knowledgeId', 'mediaId')->withPivot('order'); }
}
