<?php

namespace App\Models;

use App\Models\Concerns\BelongsToPath;
use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Model;

class ContactLink extends Model
{
    use BelongsToPath;
    use HasSortOrder;

    protected $guarded = [];
}
