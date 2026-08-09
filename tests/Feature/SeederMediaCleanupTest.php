<?php

namespace Tests\Feature;

use App\Models\GalleryPhoto;
use App\Models\SiteSetting;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Tests\TestCase;

/**
 * Re-seeding must take uploaded files with it.
 *
 * This guards two things that each silently broke it once:
 *
 *  - `WithoutModelEvents` on DatabaseSeeder muted the media library's
 *    `deleting` hook, so every re-seed orphaned rows in `media` and left the
 *    files in storage owned by models that no longer existed.
 *  - A mass `delete()` in the truncate fires no model events at all, with the
 *    same result.
 *
 * Both look completely fine from the outside: the seed succeeds and the
 * content is correct. Only the leftovers give it away.
 */
class SeederMediaCleanupTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->seed(PortfolioContentSeeder::class);
    }

    public function test_reseeding_deletes_media_attached_to_the_content_it_replaces(): void
    {
        GalleryPhoto::ordered()->first()
            ->addMedia(UploadedFile::fake()->image('shot.jpg', 100, 100))
            ->toMediaCollection(GalleryPhoto::COLLECTION);

        $this->assertSame(1, Media::count());

        $this->seed(PortfolioContentSeeder::class);

        $this->assertSame(0, Media::count(), 'Re-seeding left an orphaned media row behind.');
    }

    public function test_the_full_database_seeder_also_cleans_media_up(): void
    {
        // The bug lived in DatabaseSeeder rather than in the content seeder, so
        // the entry point people actually run has to be covered too.
        SiteSetting::resume()
            ->addMedia($this->pdf())
            ->toMediaCollection(SiteSetting::COLLECTION);

        $this->assertSame(1, Media::count());

        $this->seed(DatabaseSeeder::class);

        $this->assertSame(0, Media::count(), 'Re-seeding left an orphaned media row behind.');
    }

    /**
     * A real PDF: the media collection sniffs the stored file, and
     * `UploadedFile::fake()->create()` writes zero bytes, which lands as
     * `application/x-empty` and is refused.
     */
    private function pdf(): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'pdf');
        file_put_contents($path, "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n");

        return new UploadedFile($path, 'cv.pdf', 'application/pdf', null, true);
    }
}
