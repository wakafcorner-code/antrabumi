<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('SEED_ADMIN_EMAIL');
        $password = env('SEED_ADMIN_PASSWORD');

        if (! $email || ! $password || strlen($password) < 12) {
            throw new RuntimeException('Set SEED_ADMIN_EMAIL and a SEED_ADMIN_PASSWORD of at least 12 characters before seeding the super admin.');
        }

        User::firstOrCreate(
            ['email' => mb_strtolower($email)],
            [
                'name' => 'ANTRABUMI Super Admin',
                'passwordHash' => Hash::make($password),
                'role' => Role::SUPER_ADMIN,
                'status' => UserStatus::ACTIVE,
            ],
        );
    }
}
