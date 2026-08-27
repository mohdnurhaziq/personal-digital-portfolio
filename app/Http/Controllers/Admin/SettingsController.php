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
            // Visibility switches belong at the top of each settings panel.
            ->orderByRaw("CASE WHEN type = 'boolean' THEN 0 ELSE 1 END")
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

        $rules = [
            'settings' => ['required', 'array'],
            // Only keys that already exist are writable, so a crafted request
            // cannot invent new settings.
            'settings.*' => ['nullable', 'string'],
            'uploads' => ['nullable', 'array'],
            'remove' => ['nullable', 'array'],
            'remove.*' => ['nullable', 'boolean'],
        ];

        $messages = [];

        foreach ($known as $key => $type) {
            if ($type === SiteSetting::TYPE_BOOLEAN) {
                $rules["settings.{$key}"] = ['sometimes', 'required', 'in:0,1'];
            } elseif ($type === SiteSetting::TYPE_FILE) {
                $rules["uploads.{$key}"] = ['nullable', 'file', 'mimetypes:application/pdf', 'mimes:pdf', 'max:8192'];
                $messages["uploads.{$key}.mimetypes"] = 'The file must be a PDF.';
                $messages["uploads.{$key}.mimes"] = 'The file must be a PDF.';
                $messages["uploads.{$key}.max"] = 'The file may not be larger than 8 MB.';
            } elseif ($type === SiteSetting::TYPE_IMAGE) {
                $rules["uploads.{$key}"] = ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp', 'mimes:jpeg,jpg,png,webp', 'max:8192'];
                $messages["uploads.{$key}.mimetypes"] = 'The image must be a JPEG, PNG, or WebP.';
                $messages["uploads.{$key}.mimes"] = 'The image must be a JPEG, PNG, or WebP.';
                $messages["uploads.{$key}.max"] = 'The image may not be larger than 8 MB.';
            }
        }

        $validated = $request->validate($rules, $messages);

        foreach ($validated['settings'] as $key => $value) {
            // Upload settings own a file/image, not a typed value: their `value`
            // column is written by syncFiles and must not be posted over.
            if (! $known->has($key) || in_array($known[$key], [SiteSetting::TYPE_FILE, SiteSetting::TYPE_IMAGE], true)) {
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
        $uploadableKeys = $known->filter(
            fn (string $type) => in_array($type, [SiteSetting::TYPE_FILE, SiteSetting::TYPE_IMAGE], true),
        )->keys();

        foreach ($uploadableKeys as $key) {
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
        if (! in_array($setting->type, [SiteSetting::TYPE_FILE, SiteSetting::TYPE_IMAGE], true)) {
            return null;
        }

        $media = $setting->file();

        if ($media === null) {
            return null;
        }

        return [
            'name' => $setting->value ?: $media->file_name,
            'size' => $media->size,
            'url' => $setting->key === SiteSetting::RESUME_KEY
                ? route('resume')
                : ($setting->type === SiteSetting::TYPE_IMAGE ? $media->getUrl('display') : $media->getUrl()),
            'thumb_url' => $setting->type === SiteSetting::TYPE_IMAGE ? $media->getUrl('thumb') : null,
            'uploaded_at' => $media->created_at?->toDateString(),
        ];
    }
}
