<?php

namespace App\Models;

use App\Models\Concerns\HasImageUploads;
use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GearItem extends Model implements HasMedia
{
    use HasImageUploads;
    use HasSortOrder;
    use InteractsWithMedia;

    public const COLLECTION = 'gear';

    protected $guarded = [];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerImageConversions();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::COLLECTION)
            ->acceptsMimeTypes(self::IMAGE_MIME_TYPES)
            ->singleFile();
    }

    public function getImageUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia(self::COLLECTION);

        return $media?->getUrl('display');
    }

    public function getThumbUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia(self::COLLECTION);

        return $media?->getUrl('thumb');
    }
}
