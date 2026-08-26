<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;

class TestimonialModerationController extends Controller
{
    public function approve(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['status' => Testimonial::STATUS_APPROVED]);

        return back()->with('status', 'Testimonial approved and published.');
    }

    public function reject(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['status' => Testimonial::STATUS_REJECTED]);

        return back()->with('status', 'Testimonial rejected.');
    }
}
