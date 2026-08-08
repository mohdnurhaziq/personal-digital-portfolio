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
            'settings' => SiteSetting::values(),
            'stats' => Stat::ordered()->get(['value', 'label']),
        ]);
    }

    /**
     * Weekday path: engineering and project management.
     */
    public function programmer(): Response
    {
        return Inertia::render('Portfolio/Programmer', [
            'settings' => SiteSetting::values(),
            'tags' => Tag::forPath(Tag::PATH_DEV)->ordered()->pluck('label'),
            // Grouped here rather than in React so the page renders one card per
            // group without the client having to regroup a flat list.
            'techStacks' => TechStack::ordered()->get(['group', 'name', 'icon_slug'])
                ->groupBy('group')
                ->map(fn ($items) => $items->map->only(['name', 'icon_slug'])->values()),
            'projects' => Project::published()->ordered()->get([
                'title', 'description', 'role', 'tech', 'repo_url', 'demo_url', 'size',
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
            'settings' => SiteSetting::values(),
            'tags' => Tag::forPath(Tag::PATH_PHOTO)->ordered()->pluck('label'),
            'gear' => GearItem::ordered()->get(['category', 'value']),
            'photos' => GalleryPhoto::published()->ordered()->get([
                'id', 'title', 'caption', 'category', 'image_path',
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
