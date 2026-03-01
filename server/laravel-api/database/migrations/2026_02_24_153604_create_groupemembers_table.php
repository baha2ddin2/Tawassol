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
        Schema::create('groupemembers', function (Blueprint $table) {
            $table->uuid('groupemember')->primary();
            $table->date('joined_at');
            $table->uuid('user_id');
            $table->uuid('group_id');
            $table->enum('role',['admin','member'])->default('member');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('group_id')->references('group_id')->on('groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groupemembers');
    }
};
