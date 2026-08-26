<?php

namespace App\Models;

use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PhotoCategory extends Model
{
    use HasSortOrder;

    protected $guarded = [];

    protected static function booted(): void
    {
        static::saving(function (PhotoCategory $category): void {
            $category->name = trim($category->name);
            $category->slug = Str::slug($category->name);
        });

        // Gallery photos keep a small string slug rather than a foreign key.
        // Carrying a category rename across prevents existing photos becoming
        // detached from their filter option.
        static::updated(function (PhotoCategory $category): void {
            if ($category->wasChanged('slug')) {
                GalleryPhoto::where('category', $category->getOriginal('slug'))
                    ->update(['category' => $category->slug]);
            }
        });
    }
}
