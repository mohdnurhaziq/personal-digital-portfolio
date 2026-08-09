<?php

namespace App\Models;

use App\Models\Concerns\HasImageUploads;
use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Project extends Model implements HasMedia
{
    use HasImageUploads;
    use HasSortOrder;
    use InteractsWithMedia;

    /**
     * Screenshots of the finished thing.
     *
     * Not every project can be linked to — internal systems, work behind a
     * login, clients who would rather not be demoed — so a picture of it is
     * often the only evidence there is.
     */
    public const COLLECTION = 'screenshots';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'tech' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerImageConversions();
    }

    public function registerMediaCollections(): void
    {
        // Deliberately not singleFile: a project can carry several screenshots,
        // hand-ordered, with the first one used as the card image.
        $this->addMediaCollection(self::COLLECTION)
            ->acceptsMimeTypes(self::IMAGE_MIME_TYPES);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getScreenshotsAttribute(): array
    {
        return $this->presentMedia(self::COLLECTION);
    }
}
