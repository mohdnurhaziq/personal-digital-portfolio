<?php

namespace App\Http\Controllers\Admin;

use App\Admin\AdminResources;
use App\Admin\Resource;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'resources' => collect(AdminResources::all())
                ->map(fn (Resource $resource) => [
                    ...$resource->toArray(),
                    'count' => $resource->model::count(),
                ])
                ->values(),
        ]);
    }
}
