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
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('message_id')->primary();
            $table->string('content');
            $table->boolean('is_read')->default(false);
            $table->uuid('sender_id');
            $table->uuid('recipient_id')->nullable();
            $table->uuid('group_id')->nullable();
            $table->timestamps();
            $table->foreign('sender_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('recipient_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('group_id')->references('group_id')->on('groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
