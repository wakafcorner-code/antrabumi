<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ExperienceContributionArea', function (Blueprint $table): void {
            $table->string('experienceId', 191);
            $table->string('contributionAreaId', 191);
            $table->primary(['experienceId', 'contributionAreaId']);
            $table->foreign('experienceId')->references('id')->on('Experience')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('contributionAreaId')->references('id')->on('ContributionArea')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('ExperienceMedia', function (Blueprint $table): void {
            $table->string('experienceId', 191);
            $table->string('mediaId', 191);
            $table->integer('order')->default(0);
            $table->primary(['experienceId', 'mediaId']);
            $table->foreign('experienceId')->references('id')->on('Experience')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('mediaId')->references('id')->on('Media')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('PersonExpertise', function (Blueprint $table): void {
            $table->string('personId', 191);
            $table->string('expertiseId', 191);
            $table->integer('order')->default(0);
            $table->primary(['personId', 'expertiseId']);
            $table->foreign('personId')->references('id')->on('Person')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('expertiseId')->references('id')->on('Expertise')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('KnowledgeCategory', function (Blueprint $table): void {
            $table->string('knowledgeId', 191);
            $table->string('categoryId', 191);
            $table->primary(['knowledgeId', 'categoryId']);
            $table->foreign('knowledgeId')->references('id')->on('Knowledge')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('categoryId')->references('id')->on('Category')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('KnowledgeTag', function (Blueprint $table): void {
            $table->string('knowledgeId', 191);
            $table->string('tagId', 191);
            $table->primary(['knowledgeId', 'tagId']);
            $table->foreign('knowledgeId')->references('id')->on('Knowledge')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('tagId')->references('id')->on('Tag')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('ExperienceKnowledge', function (Blueprint $table): void {
            $table->string('experienceId', 191);
            $table->string('knowledgeId', 191);
            $table->primary(['experienceId', 'knowledgeId']);
            $table->foreign('experienceId')->references('id')->on('Experience')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('knowledgeId')->references('id')->on('Knowledge')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('KnowledgeContributionArea', function (Blueprint $table): void {
            $table->string('knowledgeId', 191);
            $table->string('contributionAreaId', 191);
            $table->primary(['knowledgeId', 'contributionAreaId']);
            $table->foreign('knowledgeId')->references('id')->on('Knowledge')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('contributionAreaId')->references('id')->on('ContributionArea')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('KnowledgeDownload', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('knowledgeId', 191)->index();
            $table->string('mediaId', 191);
            $table->string('label', 191)->nullable();
            $table->integer('order')->default(0);
            $table->foreign('knowledgeId')->references('id')->on('Knowledge')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('mediaId')->references('id')->on('Media')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('KnowledgeMedia', function (Blueprint $table): void {
            $table->string('knowledgeId', 191);
            $table->string('mediaId', 191);
            $table->integer('order')->default(0);
            $table->primary(['knowledgeId', 'mediaId']);
            $table->index('knowledgeId');
            $table->foreign('knowledgeId')->references('id')->on('Knowledge')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('mediaId')->references('id')->on('Media')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('KnowledgeMedia');
        Schema::dropIfExists('KnowledgeDownload');
        Schema::dropIfExists('KnowledgeContributionArea');
        Schema::dropIfExists('ExperienceKnowledge');
        Schema::dropIfExists('KnowledgeTag');
        Schema::dropIfExists('KnowledgeCategory');
        Schema::dropIfExists('PersonExpertise');
        Schema::dropIfExists('ExperienceMedia');
        Schema::dropIfExists('ExperienceContributionArea');
    }
};
