<?php

namespace Tests\Feature;

use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PortfolioPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PortfolioContentSeeder::class);
    }

    public function test_welcome_page_renders_with_stats_and_settings(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Portfolio/Welcome')
                ->has('stats', 3)
                ->where('settings.owner_name', 'Mohd. Nur Haziq Irsyamuddin')
            );
    }

    public function test_programmer_page_renders_every_section_from_the_database(): void
    {
        $this->get('/programmer')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Portfolio/Programmer')
                ->has('tags', 7)
                ->has('projects', 4)
                ->has('experiences', 2)
                ->has('testimonials', 2)
                ->has('certifications', 3)
                ->has('contactLinks', 3)
                ->where('settings.dev_ai_title', 'AI-assisted development')
                ->where('settings.dev_ai_tools', "Codex\nClaude Code\nGraphify")
                // Grouped server-side so the page renders one card per group.
                ->has('techStacks.Languages & frameworks', 5)
                ->has('techStacks.Data & infra', 4)
                ->has('techStacks.PM & tools', 3)
            );
    }

    public function test_photographer_page_renders_gallery_and_filter_categories(): void
    {
        $this->get('/photographer')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Portfolio/Photographer')
                ->has('tags', 6)
                ->has('gear', 3)
                ->has('photos', 8)
                // Only categories that actually have photos become filter buttons.
                ->where('categories', ['portrait', 'street', 'landscape', 'event'])
                ->has('contactLinks', 2)
            );
    }

    public function test_experience_bullets_reach_the_page_as_arrays(): void
    {
        $this->get('/programmer')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('experiences.0.bullets', 2)
            );
    }

    public function test_pages_are_public(): void
    {
        foreach (['/', '/programmer', '/photographer'] as $url) {
            $this->get($url)->assertOk();
        }
    }
}
