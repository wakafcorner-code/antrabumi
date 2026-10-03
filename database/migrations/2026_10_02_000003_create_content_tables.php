<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Page', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('slug', 191);
            $table->enum('language', ['ID', 'EN'])->index();
            $table->string('title', 191);
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('heroTitle', 191)->nullable();
            $table->string('heroDescription', 191)->nullable();
            $table->string('heroMediaId', 191)->nullable();
            $table->enum('status', ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT')->index();
            $table->string('seoTitle', 191)->nullable();
            $table->text('seoDescription')->nullable();
            $table->string('ogImageId', 191)->nullable();
            $table->dateTime('publishedAt', 3)->nullable()->index();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->unique(['slug', 'language']);
            $table->foreign('heroMediaId')->references('id')->on('Media')->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('ogImageId')->references('id')->on('Media')->nullOnDelete()->cascadeOnUpdate();
        });

        Schema::create('ContributionAreaTranslation', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('contributionAreaId', 191);
            $table->enum('language', ['ID', 'EN'])->index();
            $table->string('title', 191);
            $table->text('description')->nullable();
            $table->string('imageId', 191)->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->unique(['contributionAreaId', 'language']);
            $table->foreign('contributionAreaId')->references('id')->on('ContributionArea')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('imageId')->references('id')->on('Media')->nullOnDelete()->cascadeOnUpdate();
        });

        Schema::create('Experience', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('slug', 191)->unique();
            $table->string('type', 191)->default('EXPERIENCE')->index();
            $table->integer('year')->nullable()->index();
            $table->string('category', 191)->nullable();
            $table->string('location', 191)->nullable();
            $table->string('clientName', 191)->nullable();
            $table->enum('status', ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT')->index();
            $table->boolean('featured')->default(false)->index();
            $table->string('coverMediaId', 191)->nullable();
            $table->string('createdById', 191)->index();
            $table->string('updatedById', 191)->index();
            $table->dateTime('publishedAt', 3)->nullable()->index();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->foreign('coverMediaId')->references('id')->on('Media')->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('createdById')->references('id')->on('User')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('updatedById')->references('id')->on('User')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::create('ExperienceTranslation', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('experienceId', 191);
            $table->enum('language', ['ID', 'EN'])->index();
            $table->string('title', 191);
            $table->text('excerpt')->nullable();
            $table->longText('description')->nullable();
            $table->longText('methodology')->nullable();
            $table->longText('impact')->nullable();
            $table->string('seoTitle', 191)->nullable();
            $table->text('seoDescription')->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->unique(['experienceId', 'language']);
            $table->foreign('experienceId')->references('id')->on('Experience')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('ExperienceMetric', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('experienceId', 191)->index();
            $table->string('label', 191);
            $table->string('value', 191);
            $table->string('unit', 191)->nullable();
            $table->integer('order')->default(0);
            $table->foreign('experienceId')->references('id')->on('Experience')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('Person', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('slug', 191)->unique();
            $table->string('imageId', 191)->nullable();
            $table->enum('status', ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT')->index();
            $table->integer('order')->default(0);
            $table->string('createdById', 191)->index();
            $table->string('updatedById', 191)->index();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->foreign('imageId')->references('id')->on('Media')->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('createdById')->references('id')->on('User')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('updatedById')->references('id')->on('User')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::create('PersonTranslation', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('personId', 191);
            $table->enum('language', ['ID', 'EN']);
            $table->string('name', 191);
            $table->string('degree', 191)->nullable();
            $table->string('role', 191)->nullable();
            $table->longText('biography')->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->unique(['personId', 'language']);
            $table->foreign('personId')->references('id')->on('Person')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('Knowledge', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('slug', 191)->unique();
            $table->enum('type', ['ARTICLE', 'RESEARCH_PUBLICATION', 'STORY'])->index();
            $table->string('coverMediaId', 191)->nullable();
            $table->enum('status', ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT')->index();
            $table->boolean('featured')->default(false)->index();
            $table->string('authorName', 191)->nullable();
            $table->dateTime('publicationDate', 3)->nullable()->index();
            $table->string('createdById', 191)->index();
            $table->string('updatedById', 191)->index();
            $table->dateTime('publishedAt', 3)->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->foreign('coverMediaId')->references('id')->on('Media')->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('createdById')->references('id')->on('User')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('updatedById')->references('id')->on('User')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::create('KnowledgeTranslation', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('knowledgeId', 191);
            $table->enum('language', ['ID', 'EN'])->index();
            $table->string('title', 191);
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('seoTitle', 191)->nullable();
            $table->text('seoDescription')->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->unique(['knowledgeId', 'language']);
            $table->foreign('knowledgeId')->references('id')->on('Knowledge')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('Partner', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('name', 191);
            $table->string('slug', 191)->unique();
            $table->text('description')->nullable();
            $table->string('logoMediaId', 191)->nullable();
            $table->string('website', 191)->nullable();
            $table->string('category', 191)->nullable();
            $table->enum('status', ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT')->index();
            $table->integer('order')->default(0);
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->foreign('logoMediaId')->references('id')->on('Media')->nullOnDelete()->cascadeOnUpdate();
        });

        Schema::create('ContactMessage', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('name', 191);
            $table->string('email', 191)->index();
            $table->string('organization', 191)->nullable();
            $table->string('phone', 191)->nullable();
            $table->string('subject', 191);
            $table->text('message');
            $table->string('areaOfInterest', 191)->nullable();
            $table->enum('status', ['NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'])->default('NEW')->index();
            $table->string('assignedToId', 191)->nullable();
            $table->dateTime('createdAt', 3)->useCurrent()->index();
            $table->dateTime('updatedAt', 3);
            $table->foreign('assignedToId')->references('id')->on('User')->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ContactMessage');
        Schema::dropIfExists('Partner');
        Schema::dropIfExists('KnowledgeTranslation');
        Schema::dropIfExists('Knowledge');
        Schema::dropIfExists('PersonTranslation');
        Schema::dropIfExists('Person');
        Schema::dropIfExists('ExperienceMetric');
        Schema::dropIfExists('ExperienceTranslation');
        Schema::dropIfExists('Experience');
        Schema::dropIfExists('ContributionAreaTranslation');
        Schema::dropIfExists('Page');
    }
};
