<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class SiteSetting extends Model implements HasMedia
{
    use InteractsWithMedia;

    /** The setting whose uploaded file is the resume PDF. */
    public const RESUME_KEY = 'resume_pdf';

    /** Settings of this type own an uploaded file instead of a text value. */
    public const TYPE_FILE = 'file';

    public const COLLECTION = 'file';

    protected $guarded = [];

    /**
     * All settings as a flat key => value map, for handing to Inertia in one go.
     */
    public static function values(): Collection
    {
        return static::query()->pluck('value', 'key');
    }

    /**
     * What the public pages get: the stored values, with `resume_url` resolved
     * to the uploaded PDF when there is one. The front end then has a single
     * key to link to and never has to know where the file came from.
     */
    public static function publicValues(): Collection
    {
        $values = static::values();

        if ($url = static::resumeUrl()) {
            $values['resume_url'] = $url;
        }

        return $values;
    }

    /**
     * The served URL of the uploaded resume, or null when none is attached.
     *
     * Deliberately a route rather than the media URL: the link stays stable
     * across re-uploads, and it does not depend on APP_URL matching how the
     * site is actually being served — which is what breaks uploaded images.
     */
    public static function resumeUrl(): ?string
    {
        return static::resume()?->file()
            ? route('resume')
            : null;
    }

    public static function resume(): ?self
    {
        return static::query()
            ->where('key', self::RESUME_KEY)
            ->with('media')
            ->first();
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        return static::query()->where('key', $key)->value('value') ?? $default;
    }

    public function registerMediaCollections(): void
    {
        // One file per setting: re-uploading replaces the old one rather than
        // leaving an orphan behind.
        $this->addMediaCollection(self::COLLECTION)
            ->acceptsMimeTypes(['application/pdf'])
            ->singleFile();
    }

    public function file(): ?Media
    {
        return $this->getFirstMedia(self::COLLECTION);
    }
}
