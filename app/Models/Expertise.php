<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Expertise extends BaseModel
{
    protected $table = 'Expertise';
    protected $fillable = ['slug', 'name', 'description'];
    public function people(): BelongsToMany { return $this->belongsToMany(Person::class, 'PersonExpertise', 'expertiseId', 'personId')->withPivot('order'); }
}
