<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('Experience', function (Blueprint $table): void {
            $table->string('youtubeUrl', 500)->nullable();
        });

        Schema::table('Knowledge', function (Blueprint $table): void {
            $table->string('youtubeUrl', 500)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('Knowledge', function (Blueprint $table): void {
            $table->dropColumn('youtubeUrl');
        });

        Schema::table('Experience', function (Blueprint $table): void {
            $table->dropColumn('youtubeUrl');
        });
    }
};
