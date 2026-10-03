<?php

namespace Tests\Feature;

use App\Enums\AuditAction;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuditLogParityTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_log_view_displays_the_recorded_ip_address(): void
    {
        $admin = $this->user('audit-ip-admin@example.test');
        AuditLog::create([
            'userId' => $admin->id,
            'action' => AuditAction::UPDATE,
            'entity' => 'Knowledge',
            'entityId' => 'audit-record-with-ip',
            'metadata' => ['action' => 'update'],
            'ipAddress' => '203.0.113.42',
            'userAgent' => 'Audit parity test',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.logs.index'))
            ->assertOk()
            ->assertSee('IP')
            ->assertSee('203.0.113.42');
    }

    public function test_audit_log_pagination_matches_next_page_size_of_fifty(): void
    {
        $admin = $this->user('audit-pagination-admin@example.test');
        for ($index = 1; $index <= 30; $index++) {
            AuditLog::create([
                'userId' => $admin->id,
                'action' => AuditAction::UPDATE,
                'entity' => 'Knowledge',
                'entityId' => 'audit-record-'.$index,
                'metadata' => ['index' => $index],
            ]);
        }

        $response = $this->actingAs($admin)->get(route('admin.logs.index'))->assertOk();

        $this->assertSame(50, $response->viewData('logs')->perPage());
        $this->assertCount(30, $response->viewData('logs'));
    }

    private function user(string $email): User
    {
        return User::create([
            'name' => 'Audit Admin',
            'email' => $email,
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
    }
}