<?php

namespace App\Models;

use App\Models\Concerns\HasImageUploads;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class SiteSetting extends Model implements HasMedia
{
    use HasImageUploads;
    use InteractsWithMedia;

    /** The setting whose uploaded file is the resume PDF. */
    public const RESUME_KEY = 'resume_pdf';

    /** Settings of this type own an uploaded file instead of a text value. */
    public const TYPE_FILE = 'file';

    /** Settings of this type own an uploaded image instead of a text value. */
    public const TYPE_IMAGE = 'image';

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
     * to the uploaded PDF when there is one, and image settings resolved to URLs.
     */
    public static function publicValues(): Collection
    {
        $settings = static::query()->with('media')->get();
        $values = $settings->pluck('value', 'key');

        if ($url = static::resumeUrl()) {
            $values['resume_url'] = $url;
        }

        foreach ($settings as $setting) {
            if ($setting->type === self::TYPE_IMAGE) {
                $media = $setting->file();
                $values[$setting->key . '_url'] = $media ? $media->getUrl('display') : null;
                $values[$setting->key . '_thumb_url'] = $media ? $media->getUrl('thumb') : null;
            }
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

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerImageConversions();
    }

    public function registerMediaCollections(): void
    {
        // One file per setting: re-uploading replaces the old one rather than
        // leaving an orphan behind.
        $this->addMediaCollection(self::COLLECTION)
            ->acceptsMimeTypes(array_merge(['application/pdf'], self::IMAGE_MIME_TYPES))
            ->singleFile();
    }

    public function file(): ?Media
    {
        return $this->getFirstMedia(self::COLLECTION);
    }
}
