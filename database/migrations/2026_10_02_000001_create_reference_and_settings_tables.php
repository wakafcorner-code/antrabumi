<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Permission', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('key', 191)->unique();
            $table->string('description', 191)->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
        });

        Schema::create('ContributionArea', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('slug', 191)->unique();
            $table->enum('status', ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT')->index();
            $table->integer('order')->default(0);
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
        });

        Schema::create('Expertise', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('slug', 191)->unique();
            $table->string('name', 191);
            $table->text('description')->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
        });

        Schema::create('Category', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('slug', 191)->unique();
            $table->string('name', 191);
            $table->text('description')->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
        });

        Schema::create('Tag', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('slug', 191)->unique();
            $table->string('name', 191);
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
        });

        Schema::create('SiteSetting', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('key', 191)->unique();
            $table->longText('value')->nullable();
            $table->enum('language', ['ID', 'EN'])->nullable()->index();
            $table->string('description', 191)->nullable();
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
        });

        Schema::create('NavigationItem', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('label', 191);
            $table->string('url', 191)->nullable();
            $table->enum('language', ['ID', 'EN'])->index();
            $table->string('parentId', 191)->nullable()->index();
            $table->integer('order')->default(0);
            $table->boolean('visible')->default(true)->index();
            $table->boolean('openInNewTab')->default(false);
            $table->dateTime('createdAt', 3)->useCurrent();
            $table->dateTime('updatedAt', 3);
            $table->foreign('parentId')->references('id')->on('NavigationItem')->nullOnDelete()->cascadeOnUpdate();
        });

        Schema::create('AuditLog', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->string('userId', 191)->nullable()->index();
            $table->enum('action', ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH', 'ARCHIVE', 'UPLOAD', 'USER_ROLE_CHANGED', 'SETTING_CHANGED'])->index();
            $table->string('entity', 191)->nullable()->index();
            $table->string('entityId', 191)->nullable()->index();
            $table->json('metadata')->nullable();
            $table->string('ipAddress', 191)->nullable();
            $table->string('userAgent', 191)->nullable();
            $table->dateTime('createdAt', 3)->useCurrent()->index();
            $table->foreign('userId')->references('id')->on('User')->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('AuditLog');
        Schema::dropIfExists('NavigationItem');
        Schema::dropIfExists('SiteSetting');
        Schema::dropIfExists('Tag');
        Schema::dropIfExists('Category');
        Schema::dropIfExists('Expertise');
        Schema::dropIfExists('ContributionArea');
        Schema::dropIfExists('Permission');
    }
};
