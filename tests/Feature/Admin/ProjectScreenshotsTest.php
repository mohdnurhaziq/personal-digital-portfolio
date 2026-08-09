<?php

namespace Tests\Feature\Admin;

use App\Models\GalleryPhoto;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

/**
 * Screenshots on a project: several per project, hand-ordered, deleted one at
 * a time.
 *
 * Requests post with a `_method` override rather than calling put() directly,
 * because that is what the browser form sends — PHP does not parse multipart
 * bodies on PUT, and a test that skipped the override once passed while the
 * real form was broken.
 */
class ProjectScreenshotsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->seed(PortfolioContentSeeder::class);
        $this->actingAs(User::factory()->create());
    }

    public function test_it_stores_several_screenshots_on_one_project(): void
    {
        $project = Project::ordered()->first();

        $this->update($project, [
            'screenshots' => [
                UploadedFile::fake()->image('dashboard.png', 1200, 900),
                UploadedFile::fake()->image('settings.png', 1200, 900),
            ],
        ])->assertRedirect('/admin/projects');

        $project->refresh();

        $this->assertCount(2, $project->getMedia(Project::COLLECTION));
        $this->assertCount(2, $project->screenshots);
        $this->assertNotNull($project->screenshots[0]['thumb_url']);
    }

    public function test_uploading_again_adds_to_the_set_rather_than_replacing_it(): void
    {
        $project = Project::ordered()->first();

        $this->update($project, ['screenshots' => [UploadedFile::fake()->image('one.png')]]);
        $this->update($project, ['screenshots' => [UploadedFile::fake()->image('two.png')]]);

        // A project's screenshots accumulate — unlike the gallery, where a
        // photo row owns exactly one picture and re-uploading replaces it.
        $this->assertCount(2, $project->fresh()->getMedia(Project::COLLECTION));
    }

    public function test_screenshots_land_in_the_projects_collection_not_the_gallerys(): void
    {
        $project = Project::ordered()->first();

        $this->update($project, ['screenshots' => [UploadedFile::fake()->image('shot.png')]]);

        $media = $project->fresh()->getMedia(Project::COLLECTION)->first();

        // The controller used to hard-code the gallery's collection for every
        // image field, which would have filed these under 'photo' — a
        // collection Project never registers, so no conversions and no error.
        $this->assertSame(Project::COLLECTION, $media->collection_name);
        $this->assertNotSame(GalleryPhoto::COLLECTION, $media->collection_name);
        $this->assertNotNull($media->getUrl('thumb'));
    }

    public function test_a_non_image_in_the_batch_is_rejected_and_nothing_is_stored(): void
    {
        $project = Project::ordered()->first();

        $this->update($project, [
            'screenshots' => [
                UploadedFile::fake()->image('fine.png'),
                UploadedFile::fake()->create('notes.pdf', 10, 'application/pdf'),
            ],
        ])->assertSessionHasErrors('screenshots.1');

        $this->assertCount(0, $project->fresh()->getMedia(Project::COLLECTION));
    }

    public function test_screenshots_can_be_reordered(): void
    {
        $project = Project::ordered()->first();

        $this->update($project, [
            'screenshots' => [
                UploadedFile::fake()->image('first.png'),
                UploadedFile::fake()->image('second.png'),
            ],
        ]);

        $ids = $project->fresh()->getMedia(Project::COLLECTION)->pluck('id')->all();

        $this->post("/admin/projects/{$project->id}/media/reorder", [
            'ids' => array_reverse($ids),
        ])->assertRedirect();

        $this->assertSame(
            array_reverse($ids),
            $project->fresh()->getMedia(Project::COLLECTION)->pluck('id')->all(),
        );
    }

    public function test_a_single_screenshot_can_be_deleted(): void
    {
        $project = Project::ordered()->first();

        $this->update($project, [
            'screenshots' => [
                UploadedFile::fake()->image('keep.png'),
                UploadedFile::fake()->image('drop.png'),
            ],
        ]);

        $doomed = $project->fresh()->getMedia(Project::COLLECTION)->last();

        $this->delete("/admin/projects/{$project->id}/media/{$doomed->id}")->assertRedirect();

        $remaining = $project->fresh()->getMedia(Project::COLLECTION);

        $this->assertCount(1, $remaining);
        $this->assertSame('keep.png', $remaining->first()->file_name);
    }

    public function test_media_belonging_to_another_record_cannot_be_deleted(): void
    {
        $projects = Project::ordered()->take(2)->get();

        $this->update($projects[0], ['screenshots' => [UploadedFile::fake()->image('theirs.png')]]);

        $media = $projects[0]->fresh()->getMedia(Project::COLLECTION)->first();

        // Deleting is scoped through the record, so guessing an id from
        // another project's collection gets a 404 rather than a deletion.
        $this->delete("/admin/projects/{$projects[1]->id}/media/{$media->id}")->assertNotFound();

        $this->assertCount(1, $projects[0]->fresh()->getMedia(Project::COLLECTION));
    }

    public function test_screenshots_reach_the_public_page(): void
    {
        $project = Project::ordered()->first();

        $this->update($project, ['screenshots' => [UploadedFile::fake()->image('live.png')]]);

        $this->get('/programmer')->assertInertia(
            fn (AssertableInertia $page) => $page->has('projects.0.screenshots', 1),
        );
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function update(Project $project, array $payload): TestResponse
    {
        return $this->post("/admin/projects/{$project->id}", array_replace([
            'title' => $project->title,
            'description' => $project->description,
            'size' => $project->size,
            '_method' => 'put',
        ], $payload));
    }
}
