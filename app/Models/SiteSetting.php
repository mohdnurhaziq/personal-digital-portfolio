<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class SiteSetting extends Model
{
    protected $guarded = [];

    /**
     * All settings as a flat key => value map, for handing to Inertia in one go.
     */
    public static function values(): Collection
    {
        return static::query()->pluck('value', 'key');
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        return static::query()->where('key', $key)->value('value') ?? $default;
    }
}
