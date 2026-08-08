<?php

namespace App\Models;

use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasSortOrder;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'bullets' => 'array',
        ];
    }
}
