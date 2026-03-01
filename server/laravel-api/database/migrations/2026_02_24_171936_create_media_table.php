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
        Schema::create('media', function (Blueprint $table) {
            $table->uuid('media_id')->primary();
            $table->string('url','300');
            $table->enum('type',['video','picture']);
            $table->float('size');
            $table->string('mime_type',20);
            $table->timestamps();
            $table->uuid('post_id')->nullable();
            $table->uuid('message_id')->nullable();
            $table->foreign('post_id')->references('post_id')->on('posts')->onDelete('cascade');
            $table->foreign('message_id')->references('message_id')->on('messages')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
