<?php

namespace Tests\Feature;

use App\Enums\MediaType;
use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\Experience;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ExperienceMediaLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_can_idempotently_attach_and_remove_pdf_without_deleting_media(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR, 'experience-pdf@example.test');
        $experience = $this->experience($editor);
        $pdf = $this->media($editor, MediaType::DOCUMENT, 'report.pdf', 'application/pdf');
        Storage::disk('public')->put($pdf->storageKey, '%PDF-1.7');

        $this->actingAs($editor)
            ->post(route('admin.experiences.media.pdf.store', $experience), ['mediaId' => $pdf->id])
            ->assertRedirect(route('admin.experiences.edit', $experience));
        $this->post(route('admin.experiences.media.pdf.store', $experience), ['mediaId' => $pdf->id])
            ->assertRedirect(route('admin.experiences.edit', $experience));

        $this->assertDatabaseHas('ExperienceMedia', ['experienceId' => $experience->id, 'mediaId' => $pdf->id]);
        $this->assertSame(1, $experience->media()->where('Media.id', $pdf->id)->count());

        $this->delete(route('admin.experiences.media.pdf.destroy', [$experience, $pdf]))
            ->assertRedirect(route('admin.experiences.edit', $experience));

        $this->assertDatabaseMissing('ExperienceMedia', ['experienceId' => $experience->id, 'mediaId' => $pdf->id]);
        $this->assertDatabaseHas('Media', ['id' => $pdf->id]);
        Storage::disk('public')->assertExists($pdf->storageKey);
    }

    public function test_editor_can_idempotently_attach_and_remove_gallery_image_without_deleting_media(): void
    {
        Storage::fake('public');
        $editor = $this->user(Role::EDITOR, 'experience-gallery@example.test');
        $experience = $this->experience($editor);
        $image = $this->media($editor, MediaType::IMAGE, 'field-photo.jpg', 'image/jpeg');
        Storage::disk('public')->put($image->storageKey, 'image bytes');

        $this->actingAs($editor)
            ->post(route('admin.experiences.media.gallery.store', $experience), ['mediaId' => $image->id])
            ->assertRedirect(route('admin.experiences.edit', $experience));
        $this->post(route('admin.experiences.media.gallery.store', $experience), ['mediaId' => $image->id])
            ->assertRedirect(route('admin.experiences.edit', $experience));

        $this->assertDatabaseHas('ExperienceMedia', ['experienceId' => $experience->id, 'mediaId' => $image->id]);
        $this->assertSame(1, $experience->media()->where('Media.id', $image->id)->count());

        $this->delete(route('admin.experiences.media.gallery.destroy', [$experience, $image]))
            ->assertRedirect(route('admin.experiences.edit', $experience));

        $this->assertDatabaseMissing('ExperienceMedia', ['experienceId' => $experience->id, 'mediaId' => $image->id]);
        $this->assertDatabaseHas('Media', ['id' => $image->id]);
        Storage::disk('public')->assertExists($image->storageKey);
    }

    public function test_attachment_routes_reject_media_with_the_wrong_type(): void
    {
        $editor = $this->user(Role::EDITOR, 'experience-media-validation@example.test');
        $experience = $this->experience($editor);
        $pdf = $this->media($editor, MediaType::DOCUMENT, 'valid.pdf', 'application/pdf');
        $image = $this->media($editor, MediaType::IMAGE, 'valid.jpg', 'image/jpeg');

        $this->actingAs($editor)
            ->from(route('admin.experiences.edit', $experience))
            ->post(route('admin.experiences.media.pdf.store', $experience), ['mediaId' => $image->id])
            ->assertRedirect(route('admin.experiences.edit', $experience))
            ->assertSessionHasErrors('mediaId');

        $this->from(route('admin.experiences.edit', $experience))
            ->post(route('admin.experiences.media.gallery.store', $experience), ['mediaId' => $pdf->id])
            ->assertRedirect(route('admin.experiences.edit', $experience))
            ->assertSessionHasErrors('mediaId');

        $this->assertSame(0, $experience->media()->count());
    }

    public function test_author_cannot_attach_or_remove_experience_media(): void
    {
        $author = $this->user(Role::AUTHOR, 'experience-media-author@example.test');
        $experience = $this->experience($author);
        $pdf = $this->media($author, MediaType::DOCUMENT, 'protected.pdf', 'application/pdf');
        $image = $this->media($author, MediaType::IMAGE, 'protected.jpg', 'image/jpeg');
        $experience->media()->attach([$pdf->id => ['order' => 0], $image->id => ['order' => 1]]);

        $this->actingAs($author)
            ->post(route('admin.experiences.media.pdf.store', $experience), ['mediaId' => $pdf->id])
            ->assertForbidden();
        $this->delete(route('admin.experiences.media.pdf.destroy', [$experience, $pdf]))->assertForbidden();
        $this->post(route('admin.experiences.media.gallery.store', $experience), ['mediaId' => $image->id])->assertForbidden();
        $this->delete(route('admin.experiences.media.gallery.destroy', [$experience, $image]))->assertForbidden();

        $this->assertDatabaseHas('ExperienceMedia', ['experienceId' => $experience->id, 'mediaId' => $pdf->id]);
        $this->assertDatabaseHas('ExperienceMedia', ['experienceId' => $experience->id, 'mediaId' => $image->id]);
    }

    public function test_experience_edit_form_exposes_pdf_and_gallery_management(): void
    {
        $editor = $this->user(Role::EDITOR, 'experience-media-form@example.test');
        $experience = $this->experience($editor);

        $this->actingAs($editor)
            ->get(route('admin.experiences.edit', $experience))
            ->assertOk()
            ->assertSee('id="experience-pdf-file"', false)
            ->assertSee(route('api.media.upload', [], false), false)
            ->assertSee('id="experience-gallery-files"', false);
    }

    private function user(Role $role, string $email): User
    {
        return User::create([
            'name' => $role->value,
            'email' => $email,
            'role' => $role,
            'status' => UserStatus::ACTIVE,
        ]);
    }

    private function experience(User $user): Experience
    {
        $experience = Experience::create([
            'slug' => 'media-lifecycle-'.strtolower(str_replace(['@', '.'], '-', uniqid('', true))),
            'type' => 'EXPERIENCE',
            'createdById' => $user->id,
            'updatedById' => $user->id,
        ]);
        $experience->translations()->create(['language' => 'ID', 'title' => 'Pengalaman Lapangan']);

        return $experience;
    }

    private function media(User $user, MediaType $type, string $filename, string $mimeType): Media
    {
        return Media::create([
            'type' => $type,
            'filename' => $filename,
            'originalName' => $filename,
            'mimeType' => $mimeType,
            'size' => 128,
            'storageKey' => 'uploads/'.$filename,
            'url' => '/media-file/uploads/'.$filename,
            'uploadedById' => $user->id,
        ]);
    }
}