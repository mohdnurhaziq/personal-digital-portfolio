<?php

namespace App\Http\Middleware;

use App\Admin\AdminResources;
use App\Admin\Resource;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // The SSR process has no @routes blade directive to lean on, so the
            // route list has to travel with the page for route() to resolve
            // server-side.
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            // Sidebar links for the admin. Only built for signed-in requests so
            // the resource list is not exposed publicly.
            'adminNav' => fn () => $request->user() ? collect(AdminResources::all())
                ->map(fn (Resource $resource) => [
                    'key' => $resource->key,
                    'label' => $resource->plural,
                ])
                ->values() : null,
            'status' => fn () => $request->session()->get('status'),
        ];
    }
}
