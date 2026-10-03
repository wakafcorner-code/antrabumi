<?php

namespace App\Support;

use App\Enums\Role;

final class RoleHierarchy
{
    private const LEVELS = [
        Role::AUTHOR->value => 1,
        Role::EDITOR->value => 2,
        Role::ADMIN->value => 3,
        Role::SUPER_ADMIN->value => 4,
    ];

    public static function meetsMinimum(Role $role, Role $minimum): bool
    {
        return self::LEVELS[$role->value] >= self::LEVELS[$minimum->value];
    }
}
