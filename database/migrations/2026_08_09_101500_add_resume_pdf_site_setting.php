<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Adds the resume upload setting.
 *
 * A migration rather than a seeder change alone: site_settings is edited from
 * the admin, so an existing database must gain the row without having its
 * content wiped and re-seeded.
 */
return new class extends Migration
{
    public function up(): void
    {
        $exists = DB::table('site_settings')->where('key', 'resume_pdf')->exists();

        if (! $exists) {
            DB::table('site_settings')->insert([
                'key' => 'resume_pdf',
                'value' => null,
                'group' => 'dev',
                'type' => 'file',
                'label' => 'Resume PDF',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table('site_settings')
            ->where('key', 'resume_url')
            ->update(['label' => 'Resume URL (used only when no PDF is uploaded)']);
    }

    public function down(): void
    {
        DB::table('site_settings')->where('key', 'resume_pdf')->delete();

        DB::table('site_settings')
            ->where('key', 'resume_url')
            ->update(['label' => 'Resume PDF URL']);
    }
};
