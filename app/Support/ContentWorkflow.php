<?php

namespace App\Support;

use App\Enums\ContentStatus;
use App\Enums\Role;

final class ContentWorkflow
{
    public function canTransition(ContentStatus $from, ContentStatus $to, Role $role, bool $isOwner = false): bool
    {
        if ($from === $to) {
            return false;
        }

        if ($role === Role::AUTHOR) {
            return $isOwner && (($from === ContentStatus::DRAFT && $to === ContentStatus::REVIEW)
                || ($from === ContentStatus::DRAFT && $to === ContentStatus::ARCHIVED)
                || ($from === ContentStatus::REVIEW && $to === ContentStatus::DRAFT));
        }

        if ($to === ContentStatus::PUBLISHED && ! RoleHierarchy::meetsMinimum($role, Role::EDITOR)) {
            return false;
        }

        return match ($from) {
            ContentStatus::DRAFT => $to === ContentStatus::REVIEW || $to === ContentStatus::ARCHIVED,
            ContentStatus::REVIEW => in_array($to, [ContentStatus::DRAFT, ContentStatus::PUBLISHED, ContentStatus::ARCHIVED], true),
            ContentStatus::PUBLISHED => in_array($to, [ContentStatus::DRAFT, ContentStatus::ARCHIVED], true),
            ContentStatus::ARCHIVED => $to === ContentStatus::DRAFT,
        };
    }
}
