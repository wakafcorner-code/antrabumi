<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Person extends BaseModel
{
    protected $table = 'Person';
    protected $fillable = ['slug', 'imageId', 'status', 'order', 'createdById', 'updatedById'];
    protected function casts(): array { return ['status' => ContentStatus::class]; }
    public function image(): BelongsTo { return $this->belongsTo(Media::class, 'imageId'); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'createdById'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updatedById'); }
    public function translations(): HasMany { return $this->hasMany(PersonTranslation::class, 'personId'); }
    public function expertise(): BelongsToMany { return $this->belongsToMany(Expertise::class, 'PersonExpertise', 'personId', 'expertiseId')->withPivot('order'); }
}
