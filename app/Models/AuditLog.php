<?php

namespace App\Models;

use App\Enums\AuditAction;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends BaseModel
{
    protected $table = 'AuditLog';
    public const UPDATED_AT = null;
    protected $fillable = ['userId', 'action', 'entity', 'entityId', 'metadata', 'ipAddress', 'userAgent'];
    protected function casts(): array { return ['action' => AuditAction::class, 'metadata' => 'array']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class, 'userId'); }
}
