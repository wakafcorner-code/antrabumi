<?php

namespace App\Auth;

final class LegacyBcryptHash
{
    public static function isSourceFormat(mixed $hash): bool
    {
        return is_string($hash)
            && preg_match('~^\$2b\$12\$[./A-Za-z0-9]{53}$~D', $hash) === 1;
    }

    public static function verify(string $password, string $hash): bool
    {
        return self::isSourceFormat($hash) && password_verify($password, $hash);
    }
}