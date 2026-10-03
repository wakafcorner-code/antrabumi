<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;

class LegacyCompatibleUserProvider extends EloquentUserProvider
{
    public function validateCredentials(UserContract $user, array $credentials)
    {
        $password = $credentials['password'] ?? null;
        $hash = $user->getAuthPassword();

        if (LegacyBcryptHash::isSourceFormat($hash)) {
            return is_string($password) && LegacyBcryptHash::verify($password, $hash);
        }

        return parent::validateCredentials($user, $credentials);
    }

    public function rehashPasswordIfRequired(UserContract $user, array $credentials, bool $force = false)
    {
        if (LegacyBcryptHash::isSourceFormat($user->getAuthPassword())) {
            return;
        }

        parent::rehashPasswordIfRequired($user, $credentials, $force);
    }
}