<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends BaseModel
{
    protected $table = 'Category';
    protected $fillable = ['slug', 'name', 'description'];
    public function knowledge(): BelongsToMany { return $this->belongsToMany(Knowledge::class, 'KnowledgeCategory', 'categoryId', 'knowledgeId'); }
}
