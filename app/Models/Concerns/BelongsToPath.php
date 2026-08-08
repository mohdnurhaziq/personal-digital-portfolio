<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

/**
 * The site forks into two identities; content scoped to one half carries a path.
 */
trait BelongsToPath
{
    public const PATH_DEV = 'dev';

    public const PATH_PHOTO = 'photo';

    public const PATHS = [self::PATH_DEV, self::PATH_PHOTO];

    public function scopeForPath(Builder $query, string $path): Builder
    {
        return $query->where('path', $path);
    }
}
