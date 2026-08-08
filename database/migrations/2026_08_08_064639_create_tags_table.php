<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            // Which half of the split this teaser tag belongs to: 'dev' or 'photo'.
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['path', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
