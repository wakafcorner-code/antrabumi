<?php

namespace Tests\Feature;

use App\Enums\AuditAction;
use App\Enums\ContentStatus;
use App\Enums\KnowledgeType;
use App\Enums\MediaType;
use App\Enums\MessageStatus;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\ContactMessage;
use App\Models\Experience;
use App\Models\Knowledge;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_displays_database_metrics_and_recent_activity(): void
    {
        $user = User::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);

        Experience::create([
            'slug' => 'published-experience',
            'status' => ContentStatus::PUBLISHED,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
        Experience::create([
            'slug' => 'draft-experience',
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
        Knowledge::create([
            'slug' => 'published-knowledge',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::PUBLISHED,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
        Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'report.pdf',
            'mimeType' => 'application/pdf',
            'size' => 100,
            'storageKey' => 'report.pdf',
            'uploadedById' => $user->id,
        ]);
        ContactMessage::create([
            'name' => 'Community Contact',
            'email' => 'contact@example.test',
            'subject' => 'Collaboration enquiry',
            'message' => 'We would like to discuss a collaboration.',
            'status' => MessageStatus::NEW,
        ]);
        AuditLog::create([
            'userId' => $user->id,
            'action' => AuditAction::CREATE,
            'entity' => 'Experience',
        ]);

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertSee('data-stat="experiences-total">2', false)
            ->assertSee('data-stat="experiences-published">1', false)
            ->assertSee('data-stat="knowledge-published">1', false)
            ->assertSee('data-stat="media-documents">1', false)
            ->assertSee('data-stat="messages-new">1', false)
            ->assertSee('Collaboration enquiry')
            ->assertSee('CREATE')
            ->assertSee('Editor');
    }
}