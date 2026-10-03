<?php

namespace App\Models;

use App\Enums\MessageStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactMessage extends BaseModel
{
    protected $table = 'ContactMessage';
    protected $fillable = ['name', 'email', 'organization', 'phone', 'subject', 'message', 'areaOfInterest', 'status', 'assignedToId'];
    protected function casts(): array { return ['status' => MessageStatus::class]; }
    public function assignedTo(): BelongsTo { return $this->belongsTo(User::class, 'assignedToId'); }
}
