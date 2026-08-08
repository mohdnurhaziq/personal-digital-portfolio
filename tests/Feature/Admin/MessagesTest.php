<?php

namespace Tests\Feature\Admin;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class MessagesTest extends TestCase
{
    use RefreshDatabase;

    private function message(array $overrides = []): ContactMessage
    {
        return ContactMessage::create(array_merge([
            'name' => 'Recruiter',
            'email' => 'recruiter@example.com',
            'message' => 'A role that might suit you.',
            'path' => 'dev',
        ], $overrides));
    }

    public function test_guests_cannot_read_or_delete_messages(): void
    {
        $message = $this->message();

        $this->get('/admin/messages')->assertRedirect('/login');
        $this->delete("/admin/messages/{$message->id}")->assertRedirect('/login');

        $this->assertDatabaseHas('contact_messages', ['id' => $message->id]);
    }

    public function test_the_owner_sees_messages_newest_first(): void
    {
        $this->message(['email' => 'older@example.com', 'created_at' => now()->subDay()]);
        $this->message(['email' => 'newer@example.com']);

        $this->actingAs(User::factory()->create())
            ->get('/admin/messages')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Messages')
                ->has('messages', 2)
                ->where('messages.0.email', 'newer@example.com')
            );
    }

    public function test_the_owner_can_delete_a_message(): void
    {
        $message = $this->message();

        $this->actingAs(User::factory()->create())
            ->delete("/admin/messages/{$message->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('contact_messages', ['id' => $message->id]);
    }

    public function test_messages_are_read_only(): void
    {
        $message = $this->message();

        // There is no update route. The request falls through to the generic
        // resource routes, which 404 because 'messages' is not a registered
        // admin resource — either way nothing is writable.
        $this->actingAs(User::factory()->create())
            ->put("/admin/messages/{$message->id}", ['message' => 'tampered'])
            ->assertNotFound();

        $this->assertSame('A role that might suit you.', $message->fresh()->message);
    }
}
