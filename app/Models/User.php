<?php

namespace App\Models;

use App\Casts\PasswordHashCast;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Concerns\UsesStringPrimaryKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    use UsesStringPrimaryKey;

    protected $table = 'User';
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'passwordHash',
        'role',
        'status',
        'imageId',
        'lastLoginAt',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'passwordHash',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'role' => Role::class,
            'status' => UserStatus::class,
            'lastLoginAt' => 'datetime',
            'passwordHash' => PasswordHashCast::class,
        ];
    }

    public function getAuthPasswordName(): string { return 'passwordHash'; }
    public function image(): BelongsTo { return $this->belongsTo(Media::class, 'imageId'); }
    public function createdExperiences(): HasMany { return $this->hasMany(Experience::class, 'createdById'); }
    public function updatedExperiences(): HasMany { return $this->hasMany(Experience::class, 'updatedById'); }
    public function createdKnowledge(): HasMany { return $this->hasMany(Knowledge::class, 'createdById'); }
    public function updatedKnowledge(): HasMany { return $this->hasMany(Knowledge::class, 'updatedById'); }
    public function createdPeople(): HasMany { return $this->hasMany(Person::class, 'createdById'); }
    public function updatedPeople(): HasMany { return $this->hasMany(Person::class, 'updatedById'); }
    public function uploadedMedia(): HasMany { return $this->hasMany(Media::class, 'uploadedById'); }
    public function assignedMessages(): HasMany { return $this->hasMany(ContactMessage::class, 'assignedToId'); }
    public function auditLogs(): HasMany { return $this->hasMany(AuditLog::class, 'userId'); }
}
