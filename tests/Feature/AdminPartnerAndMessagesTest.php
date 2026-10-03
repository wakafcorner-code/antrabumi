<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\MessageStatus;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\ContactMessage;
use App\Models\Partner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPartnerAndMessagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_partners_and_review_messages_and_logs(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.partners.index'))
            ->assertOk();

        $response = $this->actingAs($admin)
            ->post(route('admin.partners.store'), [
                'name' => 'Green Valley Foundation',
                'website' => 'https://example.org',
                'category' => 'Civil Society',
                'status' => ContentStatus::PUBLISHED->value,
                'order' => 1,
                'description' => 'Community partnership for local action.',
            ]);

        $partner = Partner::where('slug', 'green-valley-foundation')->firstOrFail();
        $response->assertRedirect(route('admin.partners.edit', $partner))->assertSessionHas('success');
        $this->assertSame(ContentStatus::DRAFT->value, $partner->status->value);

        $this->actingAs($admin)
            ->patch(route('admin.partners.status', $partner), ['status' => ContentStatus::ARCHIVED->value])
            ->assertRedirect(route('admin.partners.edit', $partner))
            ->assertSessionHas('success');

        $message = ContactMessage::create([
            'name' => 'Rina',
            'email' => 'rina@example.test',
            'subject' => 'Partnership enquiry',
            'message' => 'We would like to collaborate on a field project.',
            'status' => MessageStatus::NEW,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.messages.index'))
            ->assertOk()
            ->assertSee('Partnership enquiry');

        $this->actingAs($admin)
            ->post(route('admin.messages.status', $message), ['status' => MessageStatus::READ->value])
            ->assertRedirect(route('admin.messages.show', $message))
            ->assertSessionHas('success');

        AuditLog::create([
            'userId' => $admin->id,
            'action' => 'UPDATE',
            'entity' => 'Partner',
            'entityId' => $partner->id,
            'metadata' => ['status' => 'ARCHIVED'],
        ]);

        $this->actingAs($admin)
            ->get(route('admin.logs.index'))
            ->assertOk()
            ->assertSee('Partner');
    }

    public function test_message_status_update_preserves_existing_assignment_and_records_audit(): void
    {
        $admin = User::create([
            'name' => 'Message Admin',
            'email' => 'message-admin@example.test',
            'passwordHash' => Hash::make('secret-password'),
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $assignee = User::create([
            'name' => 'Message Assignee',
            'email' => 'message-assignee@example.test',
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
        $message = ContactMessage::create([
            'name' => 'Rina',
            'email' => 'rina@example.test',
            'subject' => 'Field collaboration',
            'message' => 'We would like to collaborate.',
            'status' => MessageStatus::NEW,
            'assignedToId' => $assignee->id,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.messages.status', $message), ['status' => MessageStatus::READ->value])
            ->assertRedirect(route('admin.messages.show', $message))
            ->assertSessionHas('success');

        $message->refresh();
        $this->assertSame(MessageStatus::READ, $message->status);
        $this->assertSame($assignee->id, $message->assignedToId);

        $audit = AuditLog::query()
            ->where('entity', 'ContactMessage')
            ->where('entityId', $message->id)
            ->firstOrFail();
        $this->assertSame($admin->id, $audit->userId);
        $this->assertSame(['status' => MessageStatus::READ->value], $audit->metadata);
    }

    public function test_message_status_update_returns_to_detail_with_success_feedback(): void
    {
        $admin = User::create([
            'name' => 'Message Redirect Admin',
            'email' => 'message-redirect-admin@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $message = ContactMessage::create([
            'name' => 'Redirect Sender',
            'email' => 'redirect-sender@example.test',
            'subject' => 'Redirect behavior',
            'message' => 'Status update should return to this detail.',
            'status' => MessageStatus::NEW,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.messages.status', $message), ['status' => MessageStatus::READ->value])
            ->assertRedirect(route('admin.messages.show', $message))
            ->assertSessionHas('success');

        $this->get(route('admin.messages.show', $message))
            ->assertOk()
            ->assertSee('Status pesan berhasil diperbarui.');
    }

    public function test_message_detail_status_selection_submits_immediately(): void
    {
        $admin = User::create([
            'name' => 'Message Control Admin',
            'email' => 'message-control-admin@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $message = ContactMessage::create([
            'name' => 'Control Sender',
            'email' => 'control-sender@example.test',
            'subject' => 'Status control',
            'message' => 'Status selection should submit immediately.',
            'status' => MessageStatus::NEW,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.messages.show', $message))
            ->assertOk()
            ->assertSee('onchange="this.form.requestSubmit()"', false);
    }

    public function test_message_detail_displays_phone_collaboration_area_and_received_time(): void
    {
        $admin = User::create([
            'name' => 'Message Detail Admin',
            'email' => 'message-detail-admin@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $message = ContactMessage::create([
            'name' => 'Rina',
            'email' => 'rina@example.test',
            'organization' => 'Community Research Group',
            'phone' => '+62-812-3456-7890',
            'subject' => 'Research collaboration',
            'message' => 'We would like to discuss a collaboration.',
            'areaOfInterest' => 'Research & Assessment',
            'status' => MessageStatus::NEW,
        ]);
        $receivedAt = $message->createdAt->locale('id')->translatedFormat('d M Y H:i');

        $this->actingAs($admin)
            ->get(route('admin.messages.show', $message))
            ->assertOk()
            ->assertSee('Nomor Telepon')
            ->assertSee('+62-812-3456-7890')
            ->assertSee('href="mailto:rina@example.test"', false)
            ->assertSee('Tipe / Bidang Kolaborasi')
            ->assertSee('Research & Assessment')
            ->assertSee('Diterima pada '.$receivedAt);
    }

    public function test_message_detail_preserves_message_line_breaks(): void
    {
        $admin = User::create([
            'name' => 'Message Formatting Admin',
            'email' => 'message-formatting-admin@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $message = ContactMessage::create([
            'name' => 'Formatting Sender',
            'email' => 'formatting-sender@example.test',
            'subject' => 'Formatting check',
            'message' => "First line.\nSecond line.",
            'status' => MessageStatus::NEW,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.messages.show', $message))
            ->assertOk()
            ->assertSee('First line.')
            ->assertSee('Second line.')
            ->assertSee('whitespace-pre-wrap', false);
    }

    public function test_message_inbox_displays_organization_and_area_of_interest(): void
    {
        $admin = User::create([
            'name' => 'Inbox Admin',
            'email' => 'inbox-admin@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        ContactMessage::create([
            'name' => 'Inbox Sender',
            'email' => 'inbox-sender@example.test',
            'organization' => 'Civic Learning Collective',
            'subject' => 'Collaboration inquiry',
            'message' => 'Please contact us about this work.',
            'areaOfInterest' => 'Climate adaptation',
            'status' => MessageStatus::NEW,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.messages.index'))
            ->assertOk()
            ->assertSee('Civic Learning Collective')
            ->assertSee('Climate adaptation');
    }

    public function test_message_status_labels_match_nextjs_inbox_and_detail(): void
    {
        $admin = User::create([
            'name' => 'Status Labels Admin',
            'email' => 'status-labels-admin@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        $statusLabels = [
            MessageStatus::NEW->value => ['inbox' => 'Baru', 'detail' => 'Baru (Belum Dibaca)', 'inboxClasses' => 'bg-blue-50 text-blue-700 border-blue-200'],
            MessageStatus::READ->value => ['inbox' => 'Dibaca', 'detail' => 'Sudah Dibaca', 'inboxClasses' => 'bg-neutral-50 text-neutral-600 border-neutral-200'],
            MessageStatus::IN_PROGRESS->value => ['inbox' => 'Diproses', 'detail' => 'Sedang Diproses', 'inboxClasses' => 'bg-amber-50 text-amber-800 border-amber-200'],
            MessageStatus::RESOLVED->value => ['inbox' => 'Selesai', 'detail' => 'Selesai Ditindaklanjuti', 'inboxClasses' => 'bg-emerald-50 text-emerald-800 border-emerald-200'],
            MessageStatus::ARCHIVED->value => ['inbox' => 'Diarsipkan', 'detail' => 'Diarsipkan', 'inboxClasses' => 'bg-neutral-100 text-neutral-400 border-neutral-200'],
        ];
        $messages = [];

        foreach (array_keys($statusLabels) as $status) {
            $messages[$status] = ContactMessage::create([
                'name' => 'Status '.$status,
                'email' => strtolower($status).'@example.test',
                'subject' => 'Status label check',
                'message' => 'Status label regression fixture.',
                'status' => $status,
            ]);
        }

        $inboxResponse = $this->actingAs($admin)->get(route('admin.messages.index'))->assertOk();
        $inboxDom = new \DOMDocument();
        $previousLibxmlState = libxml_use_internal_errors(true);
        $inboxDom->loadHTML($inboxResponse->getContent());
        libxml_clear_errors();
        libxml_use_internal_errors($previousLibxmlState);
        $inboxXpath = new \DOMXPath($inboxDom);

        foreach ($statusLabels as $status => $labels) {
            $row = $inboxXpath->query("//tr[td[contains(normalize-space(.), 'Status {$status}')]]")->item(0);
            $this->assertNotNull($row);
            $statusCell = $inboxXpath->query('./td[4]', $row)->item(0);
            $this->assertNotNull($statusCell);
            $this->assertSame($labels['inbox'], trim($statusCell->textContent));
            $statusBadge = $inboxXpath->query('.//span', $statusCell)->item(0);
            $this->assertNotNull($statusBadge);
            $badgeClasses = preg_split('/\s+/', $statusBadge->getAttribute('class'), -1, PREG_SPLIT_NO_EMPTY);
            foreach (explode(' ', $labels['inboxClasses']) as $class) {
                $this->assertContains($class, $badgeClasses);
            }

            $detailResponse = $this->get(route('admin.messages.show', $messages[$status]))->assertOk();
            $detailDom = new \DOMDocument();
            $previousLibxmlState = libxml_use_internal_errors(true);
            $detailDom->loadHTML($detailResponse->getContent());
            libxml_clear_errors();
            libxml_use_internal_errors($previousLibxmlState);
            $detailXpath = new \DOMXPath($detailDom);
            $currentStatus = $detailXpath->query("//p[normalize-space(.)='Status']/following-sibling::p[1]/span")->item(0);
            $this->assertNotNull($currentStatus);
            $this->assertSame($labels['detail'], trim($currentStatus->textContent));

            $optionLabels = [];
            foreach ($detailXpath->query("//select[@name='status']/option") as $option) {
                $optionLabels[] = trim($option->textContent);
            }
            $this->assertSame(array_column($statusLabels, 'detail'), $optionLabels);
            $this->assertSame($status, $messages[$status]->fresh()->status->value);
        }
    }

    public function test_message_inbox_displays_total_for_current_status_filter(): void
    {
        $admin = User::create([
            'name' => 'Inbox Count Admin',
            'email' => 'inbox-count-admin@example.test',
            'role' => Role::ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
        foreach ([MessageStatus::NEW, MessageStatus::READ] as $status) {
            ContactMessage::create([
                'name' => 'Count '.$status->value,
                'email' => strtolower($status->value).'@example.test',
                'subject' => 'Inbox count check',
                'message' => 'Inbox count regression fixture.',
                'status' => $status,
            ]);
        }

        $this->actingAs($admin)
            ->get(route('admin.messages.index'))
            ->assertOk()
            ->assertSee('2 pesan dari formulir kontak publik');

        $this->get(route('admin.messages.index', ['status' => MessageStatus::NEW->value]))
            ->assertOk()
            ->assertSee('1 pesan dari formulir kontak publik');
    }
}
