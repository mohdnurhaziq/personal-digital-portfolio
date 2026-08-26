<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photo_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        $existing = Schema::hasTable('gallery_photos')
            ? DB::table('gallery_photos')->whereNotNull('category')->pluck('category')
            : collect();

        collect(['portrait', 'street', 'landscape', 'event'])
            ->merge($existing)
            ->filter()
            ->map(fn (string $category) => Str::slug($category))
            ->filter()
            ->unique()
            ->values()
            ->each(function (string $slug, int $position): void {
                DB::table('photo_categories')->insert([
                    'name' => Str::headline($slug),
                    'slug' => $slug,
                    'sort_order' => $position,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('photo_categories');
    }
};
