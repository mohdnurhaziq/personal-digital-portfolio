<?php

namespace App\Models;

use App\Models\Concerns\HasImageUploads;
use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GalleryPhoto extends Model implements HasMedia
{
    use HasImageUploads;
    use HasSortOrder;
    use InteractsWithMedia;

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

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerImageConversions();
    }

    public function registerMediaCollections(): void
    {
        // One photo per row: adding a new file replaces the old one rather than
        // silently piling up orphaned originals.
        $this->addMediaCollection(self::COLLECTION)
            ->acceptsMimeTypes(self::IMAGE_MIME_TYPES)
            ->singleFile();
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
