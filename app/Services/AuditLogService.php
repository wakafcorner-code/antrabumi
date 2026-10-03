<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuditLogService
{
    public function record(?User $user, AuditAction $action, ?string $entity = null, ?string $entityId = null, array $metadata = []): void
    {
        try {
            AuditLog::create([
                'userId' => $user?->id,
                'action' => $action,
                'entity' => $entity,
                'entityId' => $entityId,
                'metadata' => $metadata ?: null,
                'ipAddress' => request()->ip(),
                'userAgent' => request()->userAgent(),
            ]);
        } catch (Throwable $exception) {
            Log::error('Audit log write failed.', ['exception' => $exception::class, 'action' => $action->value]);
        }
    }
}
