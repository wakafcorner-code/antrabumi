<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('User', function (Blueprint $table) {
            $table->string('id', 191)->primary();
            $table->string('name', 191);
            $table->string('email', 191)->unique();
            $table->string('passwordHash', 191)->nullable();
            $table->enum('role', ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'])->default('AUTHOR')->index();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])->default('ACTIVE')->index();
            $table->string('imageId', 191)->nullable();
            $table->dateTime('lastLoginAt', 3)->nullable();
            $table->dateTime('createdAt', 3)->useCurrent()->index();
            $table->dateTime('updatedAt', 3);
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id', 191)->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('User');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
