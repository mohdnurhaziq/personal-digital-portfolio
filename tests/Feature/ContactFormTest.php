<?php

namespace Tests\Feature;

use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PortfolioContentSeeder::class);
        RateLimiter::clear('');
        Mail::fake();
    }

    private function valid(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Recruiter',
            'email' => 'recruiter@example.com',
            'message' => 'We have a role that might suit you.',
            'path' => 'dev',
        ], $overrides);
    }

    public function test_it_stores_and_emails_a_message(): void
    {
        $this->post('/contact', $this->valid())
            ->assertRedirect()
            ->assertSessionHas('contact');

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'recruiter@example.com',
            'path' => 'dev',
        ]);

        Mail::assertSent(ContactMessageReceived::class, function ($mail) {
            // Goes to the address the owner maintains in site settings.
            return $mail->hasTo(SiteSetting::get('contact_email'));
        });
    }

    public function test_replies_go_back_to_the_sender(): void
    {
        $this->post('/contact', $this->valid());

        Mail::assertSent(ContactMessageReceived::class, function (ContactMessageReceived $mail) {
            return $mail->hasReplyTo('recruiter@example.com');
        });
    }

    public function test_it_validates_required_fields(): void
    {
        $this->post('/contact', ['name' => '', 'email' => 'nope', 'message' => 'short'])
            ->assertSessionHasErrors(['name', 'email', 'message']);

        $this->assertSame(0, ContactMessage::count());
        Mail::assertNothingSent();
    }

    public function test_the_honeypot_rejects_bots(): void
    {
        $this->post('/contact', $this->valid(['website' => 'http://spam.example']))
            ->assertSessionHasErrors('website');

        $this->assertSame(0, ContactMessage::count());
        Mail::assertNothingSent();
    }

    public function test_it_is_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->post('/contact', $this->valid(['email' => "sender{$i}@example.com"]))
                ->assertRedirect();
        }

        // Sixth attempt within the window is refused.
        $this->post('/contact', $this->valid(['email' => 'flood@example.com']))
            ->assertStatus(429);

        $this->assertSame(5, ContactMessage::count());
    }

    public function test_a_mail_failure_still_keeps_the_message(): void
    {
        // The enquiry is the thing that matters; losing it because SMTP is
        // misconfigured is the worst outcome for a job-hunting site.
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP down'));

        $this->post('/contact', $this->valid())
            ->assertRedirect()
            ->assertSessionHas('contact');

        $this->assertDatabaseHas('contact_messages', ['email' => 'recruiter@example.com']);
    }

    public function test_messages_record_which_path_they_came_from(): void
    {
        // A booking request reads differently to a job enquiry, so the origin
        // travels with the message.
        $this->post('/contact', $this->valid(['path' => 'photo', 'email' => 'client@example.com']));
        $this->post('/contact', $this->valid(['path' => 'dev', 'email' => 'recruiter@example.com']));

        $this->assertDatabaseHas('contact_messages', ['email' => 'client@example.com', 'path' => 'photo']);
        $this->assertDatabaseHas('contact_messages', ['email' => 'recruiter@example.com', 'path' => 'dev']);
    }

    public function test_it_rejects_an_unknown_path(): void
    {
        $this->post('/contact', $this->valid(['path' => 'somewhere-else']))
            ->assertSessionHasErrors('path');

        $this->assertSame(0, ContactMessage::count());
    }
}
