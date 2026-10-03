<?php

namespace Tests\Feature;

use App\Enums\KnowledgeType;
use App\Enums\MediaType;
use App\Models\Knowledge;
use App\Models\KnowledgeDownload;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_knowledge_download_persists_without_nonexistent_timestamps(): void
    {
        $user = User::create(['name' => 'Editor', 'email' => 'editor@example.test']);
        $knowledge = Knowledge::create([
            'slug' => 'field-report',
            'type' => KnowledgeType::ARTICLE,
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
        $media = Media::create([
            'type' => MediaType::DOCUMENT,
            'filename' => 'field-report.pdf',
            'mimeType' => 'application/pdf',
            'size' => 1,
            'storageKey' => 'field-report.pdf',
            'uploadedById' => $user->id,
        ]);

        $download = KnowledgeDownload::create([
            'knowledgeId' => $knowledge->id,
            'mediaId' => $media->id,
            'label' => 'Field report',
            'order' => 0,
        ]);

        $this->assertTrue($download->exists);
        $this->assertSame($knowledge->id, $download->knowledge->id);
        $this->assertSame($media->id, $download->media->id);
    }
}