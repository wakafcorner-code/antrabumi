<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Enums\KnowledgeType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Experience;
use App\Models\Knowledge;
use App\Models\Partner;
use App\Models\Person;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminContentDeleteAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_cannot_delete_knowledge(): void
    {
        $editor = $this->editor('delete-knowledge-editor@example.test');
        $knowledge = Knowledge::create([
            'slug' => 'protected-knowledge-delete',
            'type' => KnowledgeType::ARTICLE,
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $knowledge->translations()->create(['language' => 'ID', 'title' => 'Protected knowledge']);

        $this->actingAs($editor)->delete(route('admin.knowledge.destroy', $knowledge))->assertForbidden();
        $this->assertDatabaseHas('Knowledge', ['id' => $knowledge->id]);
    }

    public function test_editor_cannot_delete_initiative(): void
    {
        $editor = $this->editor('delete-initiative-editor@example.test');
        $initiative = Experience::create([
            'slug' => 'protected-initiative-delete',
            'type' => 'INITIATIVE',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $initiative->translations()->create(['language' => 'ID', 'title' => 'Protected initiative']);

        $this->actingAs($editor)->delete(route('admin.initiatives.destroy', $initiative))->assertForbidden();
        $this->assertDatabaseHas('Experience', ['id' => $initiative->id]);
    }

    public function test_editor_cannot_delete_person(): void
    {
        $editor = $this->editor('delete-person-editor@example.test');
        $person = Person::create([
            'slug' => 'protected-person-delete',
            'status' => ContentStatus::DRAFT,
            'createdById' => $editor->id,
            'updatedById' => $editor->id,
        ]);
        $person->translations()->create(['language' => 'ID', 'name' => 'Protected person']);

        $this->actingAs($editor)->delete(route('admin.people.destroy', $person))->assertForbidden();
        $this->assertDatabaseHas('Person', ['id' => $person->id]);
    }

    public function test_editor_cannot_delete_partner(): void
    {
        $editor = $this->editor('delete-partner-editor@example.test');
        $partner = Partner::create([
            'name' => 'Protected Partner',
            'slug' => 'protected-partner-delete',
            'status' => ContentStatus::DRAFT,
        ]);

        $this->actingAs($editor)->delete(route('admin.partners.destroy', $partner))->assertForbidden();
        $this->assertDatabaseHas('Partner', ['id' => $partner->id]);
    }

    private function editor(string $email): User
    {
        return User::create([
            'name' => 'Editor',
            'email' => $email,
            'role' => Role::EDITOR,
            'status' => UserStatus::ACTIVE,
        ]);
    }
}