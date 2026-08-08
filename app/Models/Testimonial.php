<?php

namespace App\Models;

use App\Models\Concerns\HasSortOrder;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasSortOrder;

    protected $guarded = [];
}
