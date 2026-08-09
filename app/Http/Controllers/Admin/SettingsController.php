<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
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
            // File settings render a preview of what is already uploaded.
            ->with('media')
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
                    'file' => $this->presentFile($s),
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
            'uploads' => ['nullable', 'array'],
            // mimetypes checks what the file actually is; mimes checks the
            // extension. A renamed executable fails the first, a real PDF
            // called .txt fails the second, and neither should be stored.
            'uploads.*' => ['nullable', 'file', 'mimetypes:application/pdf', 'mimes:pdf', 'max:8192'],
            'remove' => ['nullable', 'array'],
            'remove.*' => ['nullable', 'boolean'],
        ], [
            'uploads.*.mimetypes' => 'The file must be a PDF.',
            'uploads.*.mimes' => 'The file must be a PDF.',
            'uploads.*.max' => 'The file may not be larger than 8 MB.',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            // File settings own an upload, not a typed value: their `value`
            // column is written by syncFiles and must not be posted over.
            if (! $known->has($key) || $known[$key] === SiteSetting::TYPE_FILE) {
                continue;
            }

            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }

        $this->syncFiles($request, $known, $validated['remove'] ?? []);

        return back()->with('status', 'Settings saved.');
    }

    /**
     * Attach newly uploaded files and honour removals.
     *
     * @param  Collection<string, string>  $known
     * @param  array<string, mixed>  $remove
     */
    private function syncFiles(Request $request, Collection $known, array $remove): void
    {
        $fileKeys = $known->filter(fn (string $type) => $type === SiteSetting::TYPE_FILE)->keys();

        foreach ($fileKeys as $key) {
            $setting = SiteSetting::query()->where('key', $key)->first();

            if ($request->hasFile("uploads.{$key}")) {
                $file = $request->file("uploads.{$key}");

                $setting->addMedia($file)
                    // Stored under a generated name: the original is chosen by
                    // whoever uploads and would end up in a public path.
                    ->usingFileName($file->hashName())
                    ->toMediaCollection(SiteSetting::COLLECTION);

                // The value column keeps the original name — it is the only
                // human-readable trace of which file this is on the form.
                $setting->update(['value' => $file->getClientOriginalName()]);

                continue;
            }

            if (filter_var($remove[$key] ?? false, FILTER_VALIDATE_BOOLEAN)) {
                $setting->clearMediaCollection(SiteSetting::COLLECTION);
                $setting->update(['value' => null]);
            }
        }
    }

    /**
     * The uploaded file behind a setting, or null when it holds text or has
     * nothing attached yet.
     *
     * @return array<string, mixed>|null
     */
    private function presentFile(SiteSetting $setting): ?array
    {
        if ($setting->type !== SiteSetting::TYPE_FILE) {
            return null;
        }

        $media = $setting->file();

        if ($media === null) {
            return null;
        }

        return [
            'name' => $setting->value ?: $media->file_name,
            'size' => $media->size,
            'url' => $setting->key === SiteSetting::RESUME_KEY ? route('resume') : $media->getUrl(),
            'uploaded_at' => $media->created_at?->toDateString(),
        ];
    }
}
