<?php

namespace Tests\Feature\Admin;

use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AboutPhotoUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->seed(PortfolioContentSeeder::class);
        $this->actingAs(User::factory()->create());
    }

    public function test_it_stores_an_uploaded_dev_about_photo_and_renders_it_on_the_programmer_page(): void
    {
        $this->submit([
            'uploads' => [
                'dev_about_photo' => UploadedFile::fake()->image('portrait.jpg', 600, 800),
            ],
        ])->assertRedirect();

        $setting = SiteSetting::where('key', 'dev_about_photo')->first();

        $this->assertNotNull($setting->file());
        $this->assertSame('portrait.jpg', $setting->value);

        $this->get('/programmer')->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('settings.dev_about_photo_url', fn ($url) => ! empty($url))
                ->where('settings.dev_about_photo_thumb_url', fn ($url) => ! empty($url))
        );
    }

    public function test_it_stores_an_uploaded_photo_about_photo_and_renders_it_on_the_photographer_page(): void
    {
        $this->submit([
            'uploads' => [
                'photo_about_photo' => UploadedFile::fake()->image('camera-guy.png', 600, 800),
            ],
        ])->assertRedirect();

        $setting = SiteSetting::where('key', 'photo_about_photo')->first();

        $this->assertNotNull($setting->file());
        $this->assertSame('camera-guy.png', $setting->value);

        $this->get('/photographer')->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('settings.photo_about_photo_url', fn ($url) => ! empty($url))
                ->where('settings.photo_about_photo_thumb_url', fn ($url) => ! empty($url))
        );
    }

    public function test_it_rejects_an_about_photo_that_is_not_an_image(): void
    {
        $pdf = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $this->submit([
            'uploads' => [
                'dev_about_photo' => $pdf,
            ],
        ])->assertSessionHasErrors('uploads.dev_about_photo');

        $setting = SiteSetting::where('key', 'dev_about_photo')->first();
        $this->assertNull($setting->file());
    }

    public function test_removing_the_photo_clears_the_url_from_public_pages(): void
    {
        $this->submit([
            'uploads' => [
                'dev_about_photo' => UploadedFile::fake()->image('me.webp', 400, 400),
            ],
        ]);

        $this->submit([
            'remove' => [
                'dev_about_photo' => true,
            ],
        ]);

        $setting = SiteSetting::where('key', 'dev_about_photo')->first();
        $this->assertNull($setting->file());
        $this->assertNull($setting->value);

        $this->get('/programmer')->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('settings.dev_about_photo_url', null)
        );
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function submit(array $payload): TestResponse
    {
        return $this->post('/admin/settings', array_replace_recursive([
            'settings' => ['owner_name' => 'Mohd. Nur Haziq Irsyamuddin'],
            '_method' => 'put',
        ], $payload));
    }
}
