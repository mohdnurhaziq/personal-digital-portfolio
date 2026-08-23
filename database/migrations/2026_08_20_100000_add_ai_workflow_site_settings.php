<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Adds the programmer path's AI workflow copy without replacing settings that
 * the owner has already edited in an existing database.
 */
return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $settings = [
            ['dev_ai_title', 'AI-assisted development', 'text', 'AI section title'],
            ['dev_ai_intro', 'I use AI as a second set of eyes across discovery, delivery, and review — speeding up the feedback loop without outsourcing engineering judgment.', 'textarea', 'AI section introduction'],
            ['dev_ai_tools', "Codex\nClaude Code\nGraphify", 'textarea', 'AI tools (one per line)'],
            ['dev_ai_discovery', 'Map unfamiliar code, surface dependencies, and turn rough product intent into a scoped plan before changing the system.', 'textarea', 'AI workflow — discovery'],
            ['dev_ai_delivery', 'Pair on focused implementation, refactors, and documentation while I choose the architecture and make the trade-offs.', 'textarea', 'AI workflow — delivery'],
            ['dev_ai_verification', 'Review every change, run the tests, inspect the browser, and stay accountable for the code that reaches production.', 'textarea', 'AI workflow — verification'],
        ];

        foreach ($settings as [$key, $value, $type, $label]) {
            DB::table('site_settings')->insertOrIgnore([
                'key' => $key,
                'value' => $value,
                'group' => 'dev',
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
            ->whereIn('key', [
                'dev_ai_title',
                'dev_ai_intro',
                'dev_ai_tools',
                'dev_ai_discovery',
                'dev_ai_delivery',
                'dev_ai_verification',
            ])
            ->delete();
    }
};
