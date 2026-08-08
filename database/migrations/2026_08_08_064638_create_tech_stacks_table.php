<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tech_stacks', function (Blueprint $table) {
            $table->id();
            // Card heading: "Languages & frameworks" / "Data & infra" / "PM & tools".
            $table->string('group');
            $table->string('name');
            // Simple Icons slug (e.g. 'laravel', 'nodedotjs'). The preview loaded
            // these from cdn.simpleicons.org; the React build maps the slug to a
            // bundled react-icons/si component instead of hitting a CDN.
            $table->string('icon_slug')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['group', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tech_stacks');
    }
};
