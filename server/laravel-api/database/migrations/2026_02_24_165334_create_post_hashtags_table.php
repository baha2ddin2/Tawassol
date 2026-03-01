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
        Schema::create('post_hashtags', function (Blueprint $table) {
            $table->uuid('postHashtage_id')->primary();
            $table->uuid('post_id');
            $table->uuid('hashtag_id');
            $table->foreign('post_id')->references('post_id')->on('posts')->onDelete('cascade');
            $table->foreign('hashtag_id')->references('hashtag_id')->on('hashtags')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_hashtags');
    }
};
