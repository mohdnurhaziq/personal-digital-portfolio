<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_links', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            // 'dev' shows email/LinkedIn/GitHub; 'photo' shows email/Instagram.
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['path', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_links');
    }
};
