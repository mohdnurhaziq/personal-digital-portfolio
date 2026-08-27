<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\ContactLink;
use App\Models\Experience;
use App\Models\GalleryPhoto;
use App\Models\GearItem;
use App\Models\PhotoCategory;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Stat;
use App\Models\Tag;
use App\Models\TechStack;
use App\Models\Testimonial;
use Database\Seeders\PortfolioContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Locks the seeded placeholder content to design/portfolio-preview-v4.html, so
 * the Inertia pages keep rendering what the static reference showed.
 */
class PortfolioContentSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PortfolioContentSeeder::class);
    }

    public function test_it_seeds_every_content_table(): void
    {
        $this->assertSame(39, SiteSetting::count());
        $this->assertSame(3, Stat::count());
        $this->assertSame(12, TechStack::count());
        $this->assertSame(4, Project::count());
        $this->assertSame(2, Experience::count());
        $this->assertSame(2, Testimonial::count());
        $this->assertSame(3, Certification::count());
        $this->assertSame(3, GearItem::count());
        $this->assertSame(4, PhotoCategory::count());
        $this->assertSame(8, GalleryPhoto::count());
    }

    public function test_path_scoped_content_is_split_between_the_two_identities(): void
    {
        $this->assertSame(7, Tag::forPath('dev')->count());
        $this->assertSame(6, Tag::forPath('photo')->count());

        $this->assertSame(
            ['hello@ziq.dev', 'LinkedIn', 'GitHub'],
            ContactLink::forPath('dev')->ordered()->pluck('label')->all(),
        );

        $this->assertSame(
            ['hello@ziq.dev', 'Instagram'],
            ContactLink::forPath('photo')->ordered()->pluck('label')->all(),
        );
    }

    public function test_gallery_preserves_the_previews_tile_order_for_the_category_filters(): void
    {
        $this->assertSame(
            ['portrait', 'street', 'landscape', 'portrait', 'event', 'street', 'landscape', 'portrait'],
            GalleryPhoto::ordered()->pluck('category')->all(),
        );

        $this->assertEmpty(
            GalleryPhoto::pluck('category')->diff(PhotoCategory::pluck('slug')),
        );
    }

    public function test_projects_keep_the_asymmetric_grid_rhythm(): void
    {
        $this->assertSame(
            ['big', 'small', 'small', 'big'],
            Project::ordered()->pluck('size')->all(),
        );
    }

    public function test_tech_stack_groups_stay_in_order(): void
    {
        $this->assertSame(
            ['Languages & frameworks', 'Data & infra', 'PM & tools'],
            TechStack::ordered()->pluck('group')->unique()->values()->all(),
        );
    }

    public function test_json_columns_round_trip_as_arrays(): void
    {
        $this->assertIsArray(Experience::ordered()->first()->bullets);
        $this->assertCount(2, Experience::ordered()->first()->bullets);
    }

    public function test_running_it_twice_does_not_duplicate_content(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        $this->assertSame(4, Project::count());
        $this->assertSame(8, GalleryPhoto::count());
        $this->assertSame(39, SiteSetting::count());
    }
}
