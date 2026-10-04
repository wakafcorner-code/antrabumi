<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\SuperAdminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class SuperAdminSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_seeder_accepts_a_six_character_password(): void
    {
        $previous = $this->setSeederEnvironment('admin@example.test', 'abc123');

        try {
            (new SuperAdminSeeder)->run();

            $user = User::where('email', 'admin@example.test')->firstOrFail();

            $this->assertSame(Role::SUPER_ADMIN, $user->role);
            $this->assertTrue(Hash::check('abc123', $user->passwordHash));
        } finally {
            $this->restoreSeederEnvironment($previous);
        }
    }

    public function test_super_admin_seeder_rejects_passwords_shorter_than_six_characters(): void
    {
        $previous = $this->setSeederEnvironment('admin@example.test', 'abc12');

        try {
            $this->expectException(RuntimeException::class);

            (new SuperAdminSeeder)->run();
        } finally {
            $this->restoreSeederEnvironment($previous);
        }
    }

    private function setSeederEnvironment(string $email, string $password): array
    {
        $keys = ['SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD'];
        $previous = [];

        foreach ($keys as $key) {
            $previous[$key] = [
                'env' => $_ENV[$key] ?? null,
                'server' => $_SERVER[$key] ?? null,
            ];
        }

        $_ENV['SEED_ADMIN_EMAIL'] = $_SERVER['SEED_ADMIN_EMAIL'] = $email;
        $_ENV['SEED_ADMIN_PASSWORD'] = $_SERVER['SEED_ADMIN_PASSWORD'] = $password;

        return $previous;
    }

    private function restoreSeederEnvironment(array $previous): void
    {
        foreach ($previous as $key => $values) {
            foreach (['env' => '_ENV', 'server' => '_SERVER'] as $source => $superglobal) {
                if ($values[$source] === null) {
                    unset($GLOBALS[$superglobal][$key]);
                } else {
                    $GLOBALS[$superglobal][$key] = $values[$source];
                }
            }
        }
    }
}
