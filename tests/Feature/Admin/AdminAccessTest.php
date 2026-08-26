<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public static function adminUrls(): array
    {
        return [
            'dashboard' => ['/admin'],
            'settings' => ['/admin/settings'],
            'resource index' => ['/admin/projects'],
            'resource create' => ['/admin/projects/create'],
        ];
    }

    #[DataProvider('adminUrls')]
    public function test_guests_are_redirected_to_login(string $url): void
    {
        $this->get($url)->assertRedirect('/login');
    }

    public function test_guests_cannot_write(): void
    {
        $this->post('/admin/projects', ['title' => 'x'])->assertRedirect('/login');
        $this->delete('/admin/projects/1')->assertRedirect('/login');
        $this->put('/admin/settings', ['settings' => []])->assertRedirect('/login');
    }

    public function test_signed_in_owner_reaches_the_admin(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin')
            ->assertOk();
    }

    public function test_sidebar_resources_are_assigned_to_clear_site_sections(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('adminNav', fn ($items) => collect($items)
                    ->mapWithKeys(fn ($item) => [$item['key'] => $item['section']])
                    ->all() === [
                        'projects' => 'dev',
                        'experiences' => 'dev',
                        'testimonials' => 'dev',
                        'certifications' => 'dev',
                        'gear' => 'photo',
                        'tech-stacks' => 'dev',
                        'tags' => 'shared',
                        'stats' => 'site',
                        'contact-links' => 'shared',
                        'gallery-photos' => 'photo',
                    ]));
    }

    public function test_public_registration_is_not_routed(): void
    {
        // Single-owner site: leaving Breeze's register routes in place would let
        // anyone create a login.
        $this->get('/register')->assertNotFound();
        $this->post('/register', [
            'name' => 'Intruder',
            'email' => 'intruder@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertNotFound();

        $this->assertDatabaseMissing('users', ['email' => 'intruder@example.com']);
    }

    public function test_unknown_resource_is_a_404_not_a_crash(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/not-a-resource')
            ->assertNotFound();
    }

    public function test_dashboard_route_sends_the_owner_to_the_admin(): void
    {
        // Breeze's auth controllers all redirect to this route name.
        $this->actingAs(User::factory()->create())
            ->get('/dashboard')
            ->assertRedirect('/admin');
    }
}
