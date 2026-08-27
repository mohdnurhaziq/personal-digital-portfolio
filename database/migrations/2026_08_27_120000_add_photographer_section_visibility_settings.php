<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $settings = [
            ['photo_section_about_enabled', 'Behind the Photos'],
            ['photo_section_gear_enabled', 'Gear'],
            ['photo_section_gallery_enabled', 'Gallery'],
            ['photo_section_bookings_enabled', 'Bookings'],
            ['photo_section_contact_enabled', 'Contact'],
        ];

        foreach ($settings as [$key, $label]) {
            DB::table('site_settings')->insertOrIgnore([
                'key' => $key,
                'value' => '1',
                'group' => 'photo',
                'type' => 'boolean',
                'label' => $label,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->whereIn('key', [
                'photo_section_about_enabled',
                'photo_section_gear_enabled',
                'photo_section_gallery_enabled',
                'photo_section_bookings_enabled',
                'photo_section_contact_enabled',
            ])
            ->delete();
    }
};
