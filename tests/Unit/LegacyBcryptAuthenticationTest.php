<?php

namespace Tests\Unit;

use App\Auth\LegacyCompatibleUserProvider;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LegacyBcryptAuthenticationTest extends TestCase
{
    public function test_synthetic_source_bcrypt_hash_authenticates_without_rehashing(): void
    {
        $password = 'synthetic-source-password';
        $hash = $this->sourceFormatHash($password);
        $sourceId = 'c'.str_repeat('a', 24);
        $user = new User();
        $user->setRawAttributes([
            'id' => $sourceId,
            'passwordHash' => $hash,
        ], true);
        $provider = new LegacyCompatibleUserProvider(app('hash'), User::class);

        $this->assertSame(60, strlen($hash));
        $this->assertStringStartsWith('$2b$12$', $hash);
        $this->assertSame($sourceId, $user->getKey());
        $this->assertTrue(password_verify($password, $hash));
        $this->assertTrue($provider->validateCredentials($user, ['password' => $password]));
        $this->assertFalse($provider->validateCredentials($user, ['password' => 'incorrect-password']));

        $provider->rehashPasswordIfRequired($user, ['password' => $password]);

        $this->assertSame($hash, $user->getAttributes()['passwordHash']);
        $this->assertFalse($user->exists);
    }

    public function test_password_cast_preserves_legacy_hashes_and_hashes_new_passwords(): void
    {
        $password = 'synthetic-source-password';
        $legacyHash = $this->sourceFormatHash($password);

        $importedUser = new User();
        $importedUser->passwordHash = $legacyHash;
        $this->assertSame($legacyHash, $importedUser->getAttributes()['passwordHash']);

        $newPassword = 'new-laravel-password';
        $newUser = new User();
        $newUser->passwordHash = $newPassword;
        $newHash = $newUser->getAttributes()['passwordHash'];

        $this->assertNotSame($newPassword, $newHash);
        $this->assertSame('bcrypt', password_get_info($newHash)['algoName']);
        $this->assertTrue(Hash::check($newPassword, $newHash));
    }

    private function sourceFormatHash(string $password): string
    {
        $phpBcryptHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

        return '$2b$'.substr($phpBcryptHash, 4);
    }
}