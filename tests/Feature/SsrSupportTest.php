<?php

namespace Tests\Feature;

use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

/**
 * Guards the pieces SSR depends on. The rendering itself needs the node process,
 * so these cover the parts that can silently regress in PHP and would leave the
 * served HTML empty again.
 */
class SsrSupportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PortfolioContentSeeder::class);
    }

    public function test_ziggy_routes_are_shared_so_route_resolves_server_side(): void
    {
        // Without this the SSR process throws on Breeze's route() calls and
        // Inertia quietly falls back to client rendering.
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('ziggy.routes.programmer')
                ->has('ziggy.routes.photographer')
                ->where('ziggy.location', config('app.url'))
            );
    }

    public function test_root_template_defines_no_title_of_its_own(): void
    {
        // A <title> in app.blade.php comes first in document order and would beat
        // the per-page title that SSR injects.
        $blade = file_get_contents(resource_path('views/app.blade.php'));

        // Strip blade comments first — this file explains the omission in prose,
        // and that explanation naturally mentions the tag.
        $markup = preg_replace('/\{\{--.*?--\}\}/s', '', $blade);

        $this->assertStringNotContainsString('<title', $markup);
    }

    public function test_root_template_pulls_no_external_font_cdn(): void
    {
        $blade = file_get_contents(resource_path('views/app.blade.php'));

        $this->assertStringNotContainsString('fonts.bunny.net', $blade);
        $this->assertStringNotContainsString('fonts.googleapis.com', $blade);
    }

    public function test_ssr_entry_point_exists_and_is_built_by_the_build_script(): void
    {
        $this->assertFileExists(resource_path('js/ssr.jsx'));

        $package = json_decode(file_get_contents(base_path('package.json')), true);
        $this->assertStringContainsString('--ssr', $package['scripts']['build']);

        $vite = file_get_contents(base_path('vite.config.js'));
        $this->assertStringContainsString("ssr: 'resources/js/ssr.jsx'", $vite);
    }
}
