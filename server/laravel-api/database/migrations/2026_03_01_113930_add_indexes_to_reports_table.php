<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->index('reporter_id');
            $table->index('target_id');
            $table->index('target_post_id');
            $table->index('target_comment_id');
        });
    }

    public function down()
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropIndex(['reporter_id']);
            $table->dropIndex(['target_id']);
            $table->dropIndex(['target_post_id']);
            $table->dropIndex(['target_comment_id']);
        });
    }
};
