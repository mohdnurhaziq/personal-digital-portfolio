<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TestimonialInvitation extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    public function testimonial(): HasOne
    {
        return $this->hasOne(Testimonial::class);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->whereNull('submitted_at');
    }
}
