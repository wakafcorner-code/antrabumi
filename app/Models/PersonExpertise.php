<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PersonExpertise extends Pivot
{
    protected $table = 'PersonExpertise';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['personId', 'expertiseId', 'order'];
    public function person(): BelongsTo { return $this->belongsTo(Person::class, 'personId'); }
    public function expertise(): BelongsTo { return $this->belongsTo(Expertise::class, 'expertiseId'); }
}
