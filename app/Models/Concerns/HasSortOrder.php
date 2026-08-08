<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

/**
 * Every content type on the site is hand-ordered from the admin, so they all
 * share the same sort_order column and the same tie-break on id.
 */
trait HasSortOrder
{
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
