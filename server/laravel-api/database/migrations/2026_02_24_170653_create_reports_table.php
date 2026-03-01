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
        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('report_id')->primary();
            $table->string('reason');
            $table->enum('status',['completed','in progress','rejected']);
            $table->date('handled_at');
            $table->uuid('reporter_id');
            $table->uuid('target_id')->nullable();
            $table->uuid('target_post_id')->nullable();
            $table->uuid('target_comment_id')->nullable();
            $table->timestamps();
            $table->foreign('reporter_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('target_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('target_post_id')->references('post_id')->on('posts')->onDelete('cascade');
            $table->foreign('target_comment_id')->references('comment_id')->on('comments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
