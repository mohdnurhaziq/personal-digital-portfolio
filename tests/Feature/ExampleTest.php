<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * The content tables are empty on a fresh deploy until the seeder runs, so
     * the public pages have to degrade to empty rather than error.
     */
    public function test_public_pages_render_with_no_content_seeded(): void
    {
        foreach (['/', '/programmer', '/photographer'] as $url) {
            $this->get($url)->assertStatus(200);
        }
    }
}
