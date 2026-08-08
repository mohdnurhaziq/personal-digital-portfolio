<?php

namespace Tests\Feature\Admin;

use App\Models\Experience;
use App\Models\GalleryPhoto;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ResourceCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PortfolioContentSeeder::class);
        $this->owner = User::factory()->create();
        $this->actingAs($this->owner);
    }

    public function test_it_creates_a_record_and_appends_it_to_the_end(): void
    {
        $last = Project::max('sort_order');

        $this->post('/admin/projects', [
            'title' => 'Real project',
            'description' => 'Something shipped.',
            'size' => 'big',
        ])->assertRedirect('/admin/projects');

        $project = Project::where('title', 'Real project')->firstOrFail();

        // New rows go last so adding one doesn't reshuffle the grid.
        $this->assertSame($last + 1, $project->sort_order);
    }

    public function test_it_rejects_invalid_input(): void
    {
        $this->post('/admin/projects', ['title' => '', 'size' => 'enormous'])
            ->assertSessionHasErrors(['title', 'description', 'size']);

        $this->assertDatabaseMissing('projects', ['size' => 'enormous']);
    }

    public function test_list_fields_round_trip_through_newlines(): void
    {
        $this->post('/admin/experiences', [
            'title' => 'Engineer',
            'company' => 'Somewhere',
            'date_range' => '2020 — 2024',
            'bullets' => "Shipped a thing\n\n  Led a team  \n",
        ])->assertRedirect('/admin/experiences');

        $experience = Experience::where('company', 'Somewhere')->firstOrFail();

        // Blank lines dropped, surrounding whitespace trimmed.
        $this->assertSame(['Shipped a thing', 'Led a team'], $experience->bullets);
    }

    public function test_it_updates_a_record(): void
    {
        $project = Project::ordered()->first();

        $this->put("/admin/projects/{$project->id}", [
            'title' => 'Renamed',
            'description' => $project->description,
            'size' => 'small',
        ])->assertRedirect('/admin/projects');

        $this->assertSame('Renamed', $project->fresh()->title);
    }

    public function test_it_deletes_a_record(): void
    {
        $project = Project::ordered()->first();

        $this->delete("/admin/projects/{$project->id}")
            ->assertRedirect('/admin/projects');

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_reordering_rewrites_sort_order(): void
    {
        $ids = Project::ordered()->pluck('id')->all();
        $reversed = array_reverse($ids);

        $this->post('/admin/projects/reorder', ['ids' => $reversed])
            ->assertRedirect();

        $this->assertSame($reversed, Project::ordered()->pluck('id')->all());
    }

    public function test_it_stores_an_uploaded_photo_and_exposes_it_publicly(): void
    {
        Storage::fake('public');

        $photo = GalleryPhoto::ordered()->first();

        $this->put("/admin/gallery-photos/{$photo->id}", [
            'category' => 'portrait',
            'title' => 'A real photo',
            'image' => UploadedFile::fake()->image('shot.jpg', 1200, 900),
        ])->assertRedirect('/admin/gallery-photos');

        $photo->refresh();

        $this->assertTrue($photo->hasMedia(GalleryPhoto::COLLECTION));
        $this->assertNotNull($photo->thumb_url);
    }

    public function test_it_rejects_a_non_image_upload(): void
    {
        Storage::fake('public');

        $photo = GalleryPhoto::ordered()->first();

        $this->put("/admin/gallery-photos/{$photo->id}", [
            'category' => 'portrait',
            'image' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
        ])->assertSessionHasErrors('image');

        $this->assertFalse($photo->fresh()->hasMedia(GalleryPhoto::COLLECTION));
    }

    public function test_settings_save_and_only_touch_known_keys(): void
    {
        $this->put('/admin/settings', [
            'settings' => [
                'owner_name' => 'New Name',
                'not_a_real_setting' => 'ignored',
            ],
        ])->assertRedirect();

        $this->assertSame('New Name', SiteSetting::get('owner_name'));
        $this->assertDatabaseMissing('site_settings', ['key' => 'not_a_real_setting']);
    }

    public function test_edits_show_up_on_the_public_site(): void
    {
        $this->put('/admin/settings', [
            'settings' => ['owner_name' => 'Edited Owner'],
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('Edited Owner', escape: false);
    }
}
