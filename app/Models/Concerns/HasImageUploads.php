<?php

namespace App\Models\Concerns;

use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Shared image-upload behaviour for the models that own uploaded pictures.
 *
 * The conversions live here rather than on each model so gallery photos and
 * project screenshots cannot drift apart: the grid never shows anything near
 * full size, so serving the original would waste most of the bytes on the page.
 */
trait HasImageUploads
{
    /**
     * What the browser's file picker and the server both accept.
     *
     * @var array<int, string>
     */
    public const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    /**
     * Called from each model's `registerMediaConversions`.
     *
     * Deliberately not named that itself: `InteractsWithMedia` already
     * declares one, and two traits offering the same method is a fatal
     * collision that has to be resolved model by model with `insteadof`.
     * A distinct name and a one-line call is plainer than that.
     */
    public function registerImageConversions(): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Fit::Max, 600, 600)
            ->nonQueued();

        $this->addMediaConversion('display')
            ->fit(Fit::Max, 1600, 1600)
            ->nonQueued();
    }

    /**
     * Shape a collection's media for the admin form and the public pages.
     *
     * @return array<int, array<string, mixed>>
     */
    public function presentMedia(string $collection): array
    {
        return $this->getMedia($collection)
            ->map(fn (Media $media) => [
                'id' => $media->id,
                'name' => $media->file_name,
                'thumb_url' => $media->getUrl('thumb'),
                'image_url' => $media->getUrl('display'),
            ])
            ->values()
            ->all();
    }
}
