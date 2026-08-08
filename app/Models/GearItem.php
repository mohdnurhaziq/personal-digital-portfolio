<?php

namespace App\Models;

use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Model;

class GearItem extends Model
{
    use HasSortOrder;

    protected $guarded = [];
}
