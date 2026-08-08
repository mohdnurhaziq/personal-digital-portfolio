<?php

namespace App\Models;

use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GalleryPhoto extends Model implements HasMedia
{
    use HasSortOrder;
    use InteractsWithMedia;

    /**
     * Drives the gallery filter buttons. 'all' is rendered by the front end and
     * is deliberately not a storable category.
     */
    public const CATEGORIES = ['portrait', 'street', 'landscape', 'event'];

    public const COLLECTION = 'photo';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function registerMediaCollections(): void
    {
        // One photo per row: adding a new file replaces the old one rather than
        // silently piling up orphaned originals.
        $this->addMediaCollection(self::COLLECTION)->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // The grid never shows anything near full size, so serving the original
        // there would waste most of the bytes downloaded on the page.
        $this->addMediaConversion('thumb')
            ->fit(Fit::Max, 600, 600)
            ->nonQueued();

        $this->addMediaConversion('display')
            ->fit(Fit::Max, 1600, 1600)
            ->nonQueued();
    }

    /**
     * Full-size URL, falling back to the plain column for rows imported before
     * uploads existed.
     */
    public function getImageUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia(self::COLLECTION);

        return $media ? $media->getUrl('display') : $this->image_path;
    }

    public function getThumbUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia(self::COLLECTION);

        return $media ? $media->getUrl('thumb') : $this->image_path;
    }
}
