<?php

namespace App\Models;

class Permission extends BaseModel
{
    protected $table = 'Permission';
    protected $fillable = ['key', 'description'];
}
