<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Partner extends BaseModel
{
    protected $table = 'Partner';
    protected $fillable = ['name', 'slug', 'description', 'logoMediaId', 'website', 'category', 'status', 'order'];
    protected function casts(): array { return ['status' => ContentStatus::class]; }
    public function logoMedia(): BelongsTo { return $this->belongsTo(Media::class, 'logoMediaId'); }
}
