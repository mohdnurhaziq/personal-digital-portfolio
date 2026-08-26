<?php

namespace Tests\Feature;

use App\Models\Testimonial;
use App\Models\TestimonialInvitation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class TestimonialInvitationWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_owner_can_generate_a_one_time_testimonial_link(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/admin/testimonials/invitations')
            ->assertRedirect('/admin/testimonials');

        $invitation = TestimonialInvitation::firstOrFail();

        $this->assertSame(64, strlen($invitation->token));

        $this->get('/admin/testimonials')->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('testimonialInvitationUrl', route('testimonial-invitations.show', $invitation->token)),
        );
    }

    public function test_guests_cannot_generate_links_or_moderate_submissions(): void
    {
        $testimonial = Testimonial::create($this->testimonial_data());

        $this->post('/admin/testimonials/invitations')->assertRedirect('/login');
        $this->post("/admin/testimonials/{$testimonial->id}/approve")->assertRedirect('/login');
        $this->post("/admin/testimonials/{$testimonial->id}/reject")->assertRedirect('/login');
    }

    public function test_anonymous_recipient_can_submit_once_and_the_testimonial_stays_pending(): void
    {
        $invitation = $this->invitation();

        $this->get(route('testimonial-invitations.show', $invitation->token))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Testimonials/Submit')
                ->where('submitted', false));

        $this->post(route('testimonial-invitations.store', $invitation->token), [
            'quote' => 'Haziq kept a difficult delivery moving and communicated clearly throughout.',
            'author_name' => 'Anonymous Client',
            'author_title' => 'Product Lead',
            'author_company' => 'Example Co',
            'website' => '',
        ])->assertRedirect(route('testimonial-invitations.show', $invitation->token));

        $testimonial = Testimonial::firstOrFail();

        $this->assertSame(Testimonial::STATUS_PENDING, $testimonial->status);
        $this->assertNotNull($testimonial->submitted_at);
        $this->assertNotNull($invitation->fresh()->submitted_at);

        $this->get('/programmer')->assertInertia(
            fn (AssertableInertia $page) => $page->has('testimonials', 0),
        );

        $this->post(route('testimonial-invitations.store', $invitation->token), [
            'quote' => 'A second response must not be stored.',
            'author_name' => 'Someone Else',
        ])->assertRedirect(route('testimonial-invitations.show', $invitation->token));

        $this->assertSame(1, Testimonial::count());
        $this->get(route('testimonial-invitations.show', $invitation->token))
            ->assertInertia(fn (AssertableInertia $page) => $page->where('submitted', true));
    }

    public function test_submission_validation_and_honeypot_are_enforced(): void
    {
        $invitation = $this->invitation();

        $this->post(route('testimonial-invitations.store', $invitation->token), [
            'quote' => '',
            'author_name' => '',
            'website' => 'https://spam.example',
        ])->assertSessionHasErrors(['quote', 'author_name', 'website']);

        $this->assertDatabaseEmpty('testimonials');
        $this->assertNull($invitation->fresh()->submitted_at);
    }

    public function test_approving_publishes_a_pending_testimonial(): void
    {
        $testimonial = Testimonial::create($this->testimonial_data());

        $this->actingAs(User::factory()->create())
            ->post("/admin/testimonials/{$testimonial->id}/approve")
            ->assertRedirect();

        $this->assertSame(Testimonial::STATUS_APPROVED, $testimonial->fresh()->status);
        $this->get('/programmer')->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('testimonials', 1)
                ->where('testimonials.0.author_name', 'Anonymous Client'),
        );
    }

    public function test_rejecting_keeps_a_submission_off_the_public_page(): void
    {
        $testimonial = Testimonial::create($this->testimonial_data());

        $this->actingAs(User::factory()->create())
            ->post("/admin/testimonials/{$testimonial->id}/reject")
            ->assertRedirect();

        $this->assertSame(Testimonial::STATUS_REJECTED, $testimonial->fresh()->status);
        $this->get('/programmer')->assertInertia(
            fn (AssertableInertia $page) => $page->has('testimonials', 0),
        );
    }

    private function invitation(): TestimonialInvitation
    {
        return TestimonialInvitation::create(['token' => Str::random(64)]);
    }

    /** @return array<string, mixed> */
    private function testimonial_data(): array
    {
        return [
            'quote' => 'A thoughtful and dependable collaborator.',
            'author_name' => 'Anonymous Client',
            'author_title' => 'Product Lead',
            'author_company' => 'Example Co',
            'status' => Testimonial::STATUS_PENDING,
            'submitted_at' => now(),
            'sort_order' => 0,
        ];
    }
}
