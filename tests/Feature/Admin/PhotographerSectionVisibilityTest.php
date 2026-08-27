<?php

namespace Tests\Feature\Admin;

use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PhotographerSectionVisibilityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PortfolioContentSeeder::class);
        $this->actingAs(User::factory()->create());
    }

    public function test_photographer_sections_are_enabled_by_default(): void
    {
        $this->assertSame(
            ['1', '1', '1', '1', '1'],
            SiteSetting::query()
                ->where('key', 'like', 'photo_section_%_enabled')
                ->orderBy('id')
                ->pluck('value')
                ->all(),
        );
    }

    public function test_admin_can_disable_a_photographer_section(): void
    {
        $this->put('/admin/settings', [
            'settings' => ['photo_section_gear_enabled' => '0'],
        ])->assertRedirect();

        $this->assertDatabaseHas('site_settings', [
            'key' => 'photo_section_gear_enabled',
            'value' => '0',
        ]);

        $this->get('/photographer')->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('settings.photo_section_gear_enabled', '0'),
        );
    }

    public function test_visibility_setting_rejects_unknown_values(): void
    {
        $this->put('/admin/settings', [
            'settings' => ['photo_section_gear_enabled' => 'maybe'],
        ])->assertSessionHasErrors('settings.photo_section_gear_enabled');

        $this->assertDatabaseHas('site_settings', [
            'key' => 'photo_section_gear_enabled',
            'value' => '1',
        ]);
    }
}
