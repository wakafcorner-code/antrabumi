<?php

namespace App\Models;

use App\Enums\MediaType;
use App\Services\Media\MediaStorageKeyResolver;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Media extends BaseModel
{
    protected $table = 'Media';
    protected $fillable = ['type', 'filename', 'originalName', 'mimeType', 'size', 'width', 'height', 'storageKey', 'url', 'altText', 'caption', 'attribution', 'uploadedById'];
    protected function casts(): array { return ['type' => MediaType::class, 'size' => 'integer']; }
    public function getUrlAttribute(?string $value): ?string
    {
        $urlPath = is_string($value) ? parse_url($value, PHP_URL_PATH) : null;
        if (! is_string($urlPath) || ! str_contains($urlPath, '/media-file/')) {
            return $value;
        }

        $storageKey = app(MediaStorageKeyResolver::class)->resolve($this->attributes['storageKey'] ?? null);

        return $storageKey === null ? $value : route('storage.media', ['path' => $storageKey], false);
    }

    public function uploader(): BelongsTo { return $this->belongsTo(User::class, 'uploadedById'); }
    public function userImages(): HasMany { return $this->hasMany(User::class, 'imageId'); }
    public function pageHeroMedia(): HasMany { return $this->hasMany(Page::class, 'heroMediaId'); }
    public function pageOgImages(): HasMany { return $this->hasMany(Page::class, 'ogImageId'); }
    public function contributionAreaImages(): HasMany { return $this->hasMany(ContributionAreaTranslation::class, 'imageId'); }
    public function experienceCovers(): HasMany { return $this->hasMany(Experience::class, 'coverMediaId'); }
    public function experiences(): BelongsToMany { return $this->belongsToMany(Experience::class, 'ExperienceMedia', 'mediaId', 'experienceId')->withPivot('order'); }
    public function personImages(): HasMany { return $this->hasMany(Person::class, 'imageId'); }
    public function knowledgeCovers(): HasMany { return $this->hasMany(Knowledge::class, 'coverMediaId'); }
    public function knowledgeDownloads(): HasMany { return $this->hasMany(KnowledgeDownload::class, 'mediaId'); }
    public function knowledgeGallery(): BelongsToMany { return $this->belongsToMany(Knowledge::class, 'KnowledgeMedia', 'mediaId', 'knowledgeId')->withPivot('order'); }
    public function partnerLogos(): HasMany { return $this->hasMany(Partner::class, 'logoMediaId'); }
}
