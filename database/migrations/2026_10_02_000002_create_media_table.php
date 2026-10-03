<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Media', function (Blueprint $table): void {
            $table->string('id', 191)->primary();
            $table->enum('type', ['IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'OTHER'])->index();
            $table->string('filename', 191);
            $table->string('originalName', 191)->nullable();
            $table->string('mimeType', 191);
            $table->bigInteger('size');
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('storageKey', 191);
            $table->string('url', 191)->nullable();
            $table->string('altText', 191)->nullable();
            $table->text('caption')->nullable();
            $table->text('attribution')->nullable();
            $table->string('uploadedById', 191)->index();
            $table->dateTime('createdAt', 3)->useCurrent()->index();
            $table->dateTime('updatedAt', 3);
            $table->foreign('uploadedById')->references('id')->on('User')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::table('User', function (Blueprint $table): void {
            $table->foreign('imageId')->references('id')->on('Media')->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('User', function (Blueprint $table): void {
            $table->dropForeign(['imageId']);
        });
        Schema::dropIfExists('Media');
    }
};
