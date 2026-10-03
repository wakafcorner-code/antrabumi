<?php

namespace App\Models;

use App\Enums\Language;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContributionAreaTranslation extends BaseModel
{
    protected $table = 'ContributionAreaTranslation';
    protected $fillable = ['contributionAreaId', 'language', 'title', 'description', 'imageId'];
    protected function casts(): array { return ['language' => Language::class]; }
    public function contributionArea(): BelongsTo { return $this->belongsTo(ContributionArea::class, 'contributionAreaId'); }
    public function image(): BelongsTo { return $this->belongsTo(Media::class, 'imageId'); }
}
