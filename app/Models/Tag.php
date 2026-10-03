<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends BaseModel
{
    protected $table = 'Tag';
    protected $fillable = ['slug', 'name'];
    public function knowledge(): BelongsToMany { return $this->belongsToMany(Knowledge::class, 'KnowledgeTag', 'tagId', 'knowledgeId'); }
}
