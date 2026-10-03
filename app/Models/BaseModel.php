<?php

namespace App\Models;

use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    use UsesStringPrimaryKey;

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $guarded = ['id'];
}
