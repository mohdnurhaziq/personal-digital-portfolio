<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TestimonialInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class TestimonialInvitationController extends Controller
{
    public function store(): RedirectResponse
    {
        TestimonialInvitation::create(['token' => Str::random(64)]);

        return redirect()
            ->route('admin.resource.index', 'testimonials')
            ->with('status', 'A new testimonial link is ready to share.');
    }
}
