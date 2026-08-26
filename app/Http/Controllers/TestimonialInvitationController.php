<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use App\Models\TestimonialInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialInvitationController extends Controller
{
    public function show(string $token): Response
    {
        $invitation = TestimonialInvitation::query()->where('token', $token)->firstOrFail();

        return Inertia::render('Testimonials/Submit', [
            'action' => route('testimonial-invitations.store', $invitation->token),
            'submitted' => $invitation->submitted_at !== null,
        ]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        $validated = $request->validate([
            'quote' => ['required', 'string', 'max:2000'],
            'author_name' => ['required', 'string', 'max:255'],
            'author_title' => ['nullable', 'string', 'max:255'],
            'author_company' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'prohibited'],
        ]);

        $alreadySubmitted = DB::transaction(function () use ($token, $validated): bool {
            $invitation = TestimonialInvitation::query()
                ->where('token', $token)
                ->lockForUpdate()
                ->firstOrFail();

            if ($invitation->submitted_at !== null) {
                return true;
            }

            Testimonial::create([
                'testimonial_invitation_id' => $invitation->id,
                'quote' => $validated['quote'],
                'author_name' => $validated['author_name'],
                'author_title' => $validated['author_title'] ?? null,
                'author_company' => $validated['author_company'] ?? null,
                'status' => Testimonial::STATUS_PENDING,
                'submitted_at' => now(),
                'sort_order' => (int) Testimonial::max('sort_order') + 1,
            ]);

            $invitation->update(['submitted_at' => now()]);

            return false;
        });

        return redirect()
            ->route('testimonial-invitations.show', $token)
            ->with('status', $alreadySubmitted
                ? 'This testimonial link has already been used.'
                : 'Thank you. Your testimonial was sent for review.');
    }
}
