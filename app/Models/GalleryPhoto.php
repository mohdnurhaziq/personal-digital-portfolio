<?php

namespace App\Models;

use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class GalleryPhoto extends Model
{
    use HasSortOrder;

    /**
     * Drives the gallery filter buttons. 'all' is rendered by the front end and
     * is deliberately not a storable category.
     */
    public const CATEGORIES = ['portrait', 'street', 'landscape', 'event'];

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
}
