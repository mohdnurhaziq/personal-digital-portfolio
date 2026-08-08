<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Site settings are a flat key/value table rather than a list of records, so
 * they get their own single-form screen instead of the generic CRUD.
 */
class SettingsController extends Controller
{
    private const GROUP_LABELS = [
        'welcome' => 'Welcome screen',
        'dev' => 'Programmer path',
        'photo' => 'Photographer path',
        'meta' => 'Shared',
    ];

    public function edit(): Response
    {
        $groups = SiteSetting::query()
            ->orderBy('id')
            ->get()
            ->groupBy('group')
            ->map(fn ($settings, $group) => [
                'key' => $group,
                'label' => self::GROUP_LABELS[$group] ?? ucfirst($group),
                'settings' => $settings->map(fn (SiteSetting $s) => [
                    'key' => $s->key,
                    'label' => $s->label ?? $s->key,
                    'type' => $s->type,
                    'value' => $s->value,
                ])->values(),
            ])
            ->values();

        return Inertia::render('Admin/Settings', [
            'groups' => $groups,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $known = SiteSetting::query()->pluck('type', 'key');

        $validated = $request->validate([
            'settings' => ['required', 'array'],
            // Only keys that already exist are writable, so a crafted request
            // cannot invent new settings.
            'settings.*' => ['nullable', 'string'],
        ]);

        foreach ($validated['settings'] as $key => $value) {
            if (! $known->has($key)) {
                continue;
            }

            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }

        return back()->with('status', 'Settings saved.');
    }
}
