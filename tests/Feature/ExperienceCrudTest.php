<?php

namespace Tests\Feature;

use App\Enums\AuditAction;
use App\Enums\ContentStatus;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\Experience;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExperienceCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_can_create_experience_with_generated_slug_and_translations(): void
    {
        $editor = $this->user(Role::EDITOR, 'editor@example.test');

        $response = $this->actingAs($editor)->post(route('admin.experiences.store'), [
            'type' => 'EXPERIENCE',
            'titleId' => 'Assessment Batik Ekologis',
            'titleEn' => 'Ecological Batik Assessment',
            'excerptId' => 'Ringkasan ID',
            'bodyId' => '<p>Konten ID</p>',
            'year' => '2024',
        ]);

        $experience = Experience::where('slug', 'assessment-batik-ekologis')->firstOrFail();
        $response->assertRedirect(route('admin.experiences.edit', $experience));
        $this->assertSame(ContentStatus::DRAFT, $experience->status);
        $this->assertSame($editor->id, $experience->createdById);
        $this->assertSame('Assessment Batik Ekologis', $experience->translations()->where('language', 'ID')->value('title'));
        $this->assertSame('Ecological Batik Assessment', $experience->translations()->where('language', 'EN')->value('title'));
        $this->assertSame(AuditAction::CREATE, AuditLog::latest('createdAt')->value('action'));
    }

    public function test_experience_create_and_edit_pages_render_the_cms_forms(): void
    {
        $editor = $this->user(Role::EDITOR, 'editor@example.test');
        $experience = $this->experience($editor);

        $this->actingAs($editor)
            ->get(route('admin.experiences.new'))
            ->assertOk()
            ->assertSee('Tambah Pengalaman')
            ->assertSee('name="titleId"', false);

        $this->get(route('admin.experiences.edit', $experience))
            ->assertOk()
            ->assertSee('Pengalaman Lapangan')
            ->assertSee('Simpan Perubahan');
    }

    public function test_invalid_experience_data_returns_field_validation_errors(): void
    {
        $editor = $this->user(Role::EDITOR, 'editor@example.test');

        $this->actingAs($editor)
            ->from(route('admin.experiences.new'))
            ->post(route('admin.experiences.store'), ['titleId' => ''])
            ->assertRedirect(route('admin.experiences.new'))
            ->assertSessionHasErrors(['titleId', 'slug']);
    }

    public function test_edit_requires_existing_slug_instead_of_regenerating_it(): void
    {
        $editor = $this->user(Role::EDITOR, 'editor@example.test');
        $experience = $this->experience($editor);

        $this->actingAs($editor)
            ->from(route('admin.experiences.edit', $experience))
            ->put(route('admin.experiences.update', $experience), [
                'titleId' => 'Judul Baru',
                'slug' => '',
            ])
            ->assertRedirect(route('admin.experiences.edit', $experience))
            ->assertSessionHasErrors('slug');
    }

    public function test_experience_update_saves_translation_and_published_status_timestamp(): void
    {
        $editor = $this->user(Role::EDITOR, 'editor@example.test');
        $experience = $this->experience($editor);

        $this->actingAs($editor)->put(route('admin.experiences.update', $experience), [
            'type' => 'EXPERIENCE',
            'status' => 'PUBLISHED',
            'slug' => 'field-experience',
            'titleId' => 'Judul Diperbarui',
        ])->assertRedirect(route('admin.experiences.edit', $experience));

        $experience->refresh();
        $this->assertSame(ContentStatus::PUBLISHED, $experience->status);
        $this->assertNotNull($experience->publishedAt);
        $this->assertSame('Judul Diperbarui', $experience->translations()->where('language', 'ID')->value('title'));
    }

    public function test_status_action_records_publish_audit_and_preserves_transition_timestamp(): void
    {
        $editor = $this->user(Role::EDITOR, 'editor@example.test');
        $experience = $this->experience($editor);

        $this->actingAs($editor)->patch(route('admin.experiences.status', $experience), [
            'status' => 'PUBLISHED',
        ])->assertRedirect(route('admin.experiences.edit', $experience));

        $experience->refresh();
        $this->assertSame(ContentStatus::PUBLISHED, $experience->status);
        $this->assertNotNull($experience->publishedAt);
        $this->assertDatabaseHas('AuditLog', [
            'entityId' => $experience->id,
            'action' => AuditAction::PUBLISH->value,
        ]);
    }

    public function test_editor_cannot_delete_experience(): void
    {
        $editor = $this->user(Role::EDITOR, 'editor@example.test');
        $experience = $this->experience($editor);

        $this->actingAs($editor)
            ->delete(route('admin.experiences.destroy', $experience))
            ->assertForbidden();

        $this->assertDatabaseHas('Experience', ['id' => $experience->id]);
    }

    public function test_admin_can_delete_experience_and_cascade_its_translations(): void
    {
        $admin = $this->user(Role::ADMIN, 'admin@example.test');
        $experience = $this->experience($admin);

        $this->actingAs($admin)
            ->delete(route('admin.experiences.destroy', $experience))
            ->assertRedirect(route('admin.experiences.index'));

        $this->assertDatabaseMissing('Experience', ['id' => $experience->id]);
        $this->assertDatabaseMissing('ExperienceTranslation', ['experienceId' => $experience->id]);
    }

    private function user(Role $role, string $email): User
    {
        return User::create(['name' => $role->value, 'email' => $email, 'role' => $role, 'status' => UserStatus::ACTIVE]);
    }

    private function experience(User $user): Experience
    {
        $experience = Experience::create([
            'slug' => 'field-experience',
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
        $experience->translations()->create(['language' => 'ID', 'title' => 'Pengalaman Lapangan']);

        return $experience;
    }
}