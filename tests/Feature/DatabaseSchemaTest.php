<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\QueryException;
use App\Models\Experience;
use App\Models\User;
use Tests\TestCase;

class DatabaseSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_prisma_domain_tables_exist(): void
    {
        $tables = [
            'User', 'Permission', 'Page', 'ContributionArea', 'ContributionAreaTranslation',
            'Experience', 'ExperienceTranslation', 'ExperienceMetric', 'ExperienceContributionArea',
            'ExperienceMedia', 'Person', 'PersonTranslation', 'Expertise', 'PersonExpertise',
            'Knowledge', 'KnowledgeTranslation', 'Category', 'KnowledgeCategory', 'Tag',
            'KnowledgeTag', 'ExperienceKnowledge', 'KnowledgeContributionArea', 'KnowledgeDownload',
            'KnowledgeMedia', 'Media', 'Partner', 'ContactMessage', 'NavigationItem', 'SiteSetting',
            'AuditLog',
        ];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table), "Missing Prisma table: {$table}");
        }
    }

    public function test_critical_foreign_key_delete_rules_match_prisma(): void
    {
        $this->assertForeignKey('Experience', 'createdById', 'User', 'RESTRICT');
        $this->assertForeignKey('ExperienceTranslation', 'experienceId', 'Experience', 'CASCADE');
        $this->assertForeignKey('Experience', 'coverMediaId', 'Media', 'SET NULL');
        $this->assertForeignKey('ExperienceMedia', 'mediaId', 'Media', 'CASCADE');
        $this->assertForeignKey('ContactMessage', 'assignedToId', 'User', 'SET NULL');
    }

    public function test_experience_nullable_fields_indexes_and_timestamps_are_defined(): void
    {
        $columns = collect(Schema::getColumns('Experience'))->keyBy('name');
        $indexes = collect(Schema::getIndexes('Experience'));

        $this->assertTrue($columns['coverMediaId']['nullable']);
        $this->assertTrue($columns['year']['nullable']);
        $this->assertFalse($columns['createdAt']['nullable']);
        $this->assertFalse($columns['updatedAt']['nullable']);
        $this->assertTrue($indexes->contains(fn (array $index): bool => $index['unique'] && $index['columns'] === ['slug']));
        $this->assertTrue($indexes->contains(fn (array $index): bool => in_array('status', $index['columns'], true)));

        $user = User::create(['name' => 'Editor', 'email' => 'db-schema@example.test']);
        $experience = Experience::create([
            'slug' => 'schema-check',
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);

        $this->assertNull($experience->coverMediaId);
        $this->assertNull($experience->year);
        $this->assertNotNull($experience->createdAt);
        $this->assertNotNull($experience->updatedAt);
    }

    public function test_experience_slug_unique_constraint_is_enforced(): void
    {
        $user = User::create(['name' => 'Editor', 'email' => 'db-unique@example.test']);
        Experience::create([
            'slug' => 'unique-check',
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);

        $this->expectException(QueryException::class);
        Experience::create([
            'slug' => 'unique-check',
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
    }

    private function assertForeignKey(string $table, string $column, string $references, string $onDelete): void
    {
        $foreignKeys = DB::select("PRAGMA foreign_key_list('{$table}')");

        $foreignKey = collect($foreignKeys)->first(fn (object $key): bool =>
            $key->from === $column && $key->table === $references
        );

        $this->assertNotNull($foreignKey, "Missing {$table}.{$column} foreign key to {$references}");
        $this->assertSame($onDelete, strtoupper($foreignKey->on_delete));
    }
}