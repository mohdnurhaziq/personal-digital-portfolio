<?php

namespace App\Models;

use App\Models\Concerns\HasImageUploads;
use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Certification extends Model implements HasMedia
{
    use HasImageUploads;
    use HasSortOrder;
    use InteractsWithMedia;

    public const COLLECTION = 'certificate';

    protected $guarded = [];

    public function registerMediaConversions(?Media $media = null): void
    {
        if ($media && str_starts_with($media->mime_type, 'image/')) {
            $this->registerImageConversions();
        }
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::COLLECTION)
            ->acceptsMimeTypes([...self::IMAGE_MIME_TYPES, 'application/pdf'])
            ->singleFile();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getAttachmentAttribute(): ?array
    {
        $media = $this->getFirstMedia(self::COLLECTION);

        if (! $media) {
            return null;
        }

        $isImage = str_starts_with($media->mime_type, 'image/');

        return [
            'id' => $media->id,
            'name' => $media->file_name,
            'url' => $media->getUrl(),
            'preview_url' => $isImage && $media->hasGeneratedConversion('display')
                ? $media->getUrl('display')
                : $media->getUrl(),
            'kind' => $isImage ? 'image' : 'pdf',
            'mime_type' => $media->mime_type,
        ];
    }
}
