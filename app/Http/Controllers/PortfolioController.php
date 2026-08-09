<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\ContactLink;
use App\Models\Experience;
use App\Models\GalleryPhoto;
use App\Models\GearItem;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Stat;
use App\Models\Tag;
use App\Models\TechStack;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Landing: the welcome screen and the Programmer/Photographer fork.
     */
    public function welcome(): Response
    {
        return Inertia::render('Portfolio/Welcome', [
            'settings' => SiteSetting::publicValues(),
            'stats' => Stat::ordered()->get(['value', 'label']),
        ]);
    }

    /**
     * Weekday path: engineering and project management.
     */
    public function programmer(): Response
    {
        return Inertia::render('Portfolio/Programmer', [
            'settings' => SiteSetting::publicValues(),
            'tags' => Tag::forPath(Tag::PATH_DEV)->ordered()->pluck('label'),
            // Grouped here rather than in React so the page renders one card per
            // group without the client having to regroup a flat list.
            'techStacks' => TechStack::ordered()->get(['group', 'name', 'icon_slug'])
                ->groupBy('group')
                ->map(fn ($items) => $items->map->only(['name', 'icon_slug'])->values()),
            // Eager load media so the grid doesn't fire a query per card.
            'projects' => Project::published()->ordered()->with('media')->get()
                ->map(fn (Project $project) => [
                    'title' => $project->title,
                    'description' => $project->description,
                    'role' => $project->role,
                    'tech' => $project->tech,
                    'repo_url' => $project->repo_url,
                    'demo_url' => $project->demo_url,
                    'size' => $project->size,
                    'screenshots' => $project->screenshots,
                ]),
            'experiences' => Experience::ordered()->get(['title', 'company', 'date_range', 'bullets']),
            'testimonials' => Testimonial::ordered()->get(['quote', 'author_name', 'author_title', 'author_company']),
            'certifications' => Certification::ordered()->get(['name', 'issuer', 'year', 'credential_url']),
            'contactLinks' => ContactLink::forPath(ContactLink::PATH_DEV)->ordered()->get(['label', 'url']),
        ]);
    }

    /**
     * Weekend path: photography.
     */
    public function photographer(): Response
    {
        return Inertia::render('Portfolio/Photographer', [
            'settings' => SiteSetting::publicValues(),
            'tags' => Tag::forPath(Tag::PATH_PHOTO)->ordered()->pluck('label'),
            'gear' => GearItem::ordered()->get(['category', 'value']),
            // Eager load media so the grid doesn't fire a query per tile.
            'photos' => GalleryPhoto::published()->ordered()->with('media')->get()
                ->map(fn (GalleryPhoto $photo) => [
                    'id' => $photo->id,
                    'title' => $photo->title,
                    'caption' => $photo->caption,
                    'category' => $photo->category,
                    'thumb_url' => $photo->thumb_url,
                    'image_url' => $photo->image_url,
                ]),
            // Only categories that actually have photos become filter buttons —
            // an empty filter would look broken.
            'categories' => GalleryPhoto::published()
                ->ordered()
                ->pluck('category')
                ->unique()
                ->values(),
            'contactLinks' => ContactLink::forPath(ContactLink::PATH_PHOTO)->ordered()->get(['label', 'url']),
        ]);
    }
}
