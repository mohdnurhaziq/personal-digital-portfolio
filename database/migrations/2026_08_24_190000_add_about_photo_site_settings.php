<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Adds about photo settings for the programmer and photographer paths.
 */
return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $settings = [
            ['dev_about_photo', null, 'dev', 'image', 'About section photo'],
            ['photo_about_photo', null, 'photo', 'image', 'About section photo'],
        ];

        foreach ($settings as [$key, $value, $group, $type, $label]) {
            DB::table('site_settings')->insertOrIgnore([
                'key' => $key,
                'value' => $value,
                'group' => $group,
                'type' => $type,
                'label' => $label,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->whereIn('key', ['dev_about_photo', 'photo_about_photo'])
            ->delete();
    }
};
