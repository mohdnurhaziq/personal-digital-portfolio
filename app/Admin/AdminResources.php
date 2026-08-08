<?php

namespace App\Admin;

use App\Models\Certification;
use App\Models\ContactLink;
use App\Models\Experience;
use App\Models\GalleryPhoto;
use App\Models\GearItem;
use App\Models\Project;
use App\Models\Stat;
use App\Models\Tag;
use App\Models\TechStack;
use App\Models\Testimonial;

/**
 * The registry of everything the owner can edit from /admin.
 */
class AdminResources
{
    /**
     * @return array<string, resource>
     */
    public static function all(): array
    {
        static $resources = null;

        return $resources ??= collect(self::definitions())
            ->keyBy(fn (Resource $resource) => $resource->key)
            ->all();
    }

    public static function find(string $key): ?Resource
    {
        return self::all()[$key] ?? null;
    }

    /**
     * @return array<int, resource>
     */
    private static function definitions(): array
    {
        $pathOptions = [
            ['value' => 'dev', 'label' => 'Programmer (weekday)'],
            ['value' => 'photo', 'label' => 'Photographer (weekend)'],
        ];

        return [
            new Resource(
                key: 'projects',
                model: Project::class,
                singular: 'Project',
                plural: 'Projects',
                description: 'Selected work shown on the programmer path.',
                columns: ['title', 'size'],
                fields: [
                    Field::make('title', 'Title', rules: ['required', 'string', 'max:255']),
                    Field::make('description', 'Description', Field::TEXTAREA, ['required', 'string']),
                    Field::make('role', 'Your role', rules: ['nullable', 'string', 'max:255']),
                    Field::make('tech', 'Tech used', Field::LIST, ['nullable', 'string'], help: 'One per line.'),
                    Field::make('repo_url', 'Repository URL', Field::URL, ['nullable', 'url', 'max:255']),
                    Field::make('demo_url', 'Demo URL', Field::URL, ['nullable', 'url', 'max:255']),
                    Field::make('size', 'Card size', Field::SELECT, ['required', 'in:big,small'], [
                        ['value' => 'big', 'label' => 'Big (two thirds)'],
                        ['value' => 'small', 'label' => 'Small (one third)'],
                    ], 'Alternating sizes are what give the grid its rhythm.'),
                ],
            ),

            new Resource(
                key: 'experiences',
                model: Experience::class,
                singular: 'Role',
                plural: 'Experience',
                description: 'Work history timeline.',
                columns: ['title', 'company', 'date_range'],
                fields: [
                    Field::make('title', 'Job title', rules: ['required', 'string', 'max:255']),
                    Field::make('company', 'Company', rules: ['required', 'string', 'max:255']),
                    Field::make('date_range', 'Dates', rules: ['required', 'string', 'max:255'], help: 'Free text, e.g. "2023 — Present".'),
                    Field::make('bullets', 'Achievements', Field::LIST, ['nullable', 'string'], help: 'One per line.'),
                ],
            ),

            new Resource(
                key: 'testimonials',
                model: Testimonial::class,
                singular: 'Testimonial',
                plural: 'Testimonials',
                columns: ['author_name', 'author_company'],
                fields: [
                    Field::make('quote', 'Quote', Field::TEXTAREA, ['required', 'string']),
                    Field::make('author_name', 'Author', rules: ['required', 'string', 'max:255']),
                    Field::make('author_title', 'Author title', rules: ['nullable', 'string', 'max:255']),
                    Field::make('author_company', 'Author company', rules: ['nullable', 'string', 'max:255']),
                ],
            ),

            new Resource(
                key: 'certifications',
                model: Certification::class,
                singular: 'Certification',
                plural: 'Certifications',
                columns: ['name', 'issuer', 'year'],
                fields: [
                    Field::make('name', 'Name', rules: ['required', 'string', 'max:255']),
                    Field::make('issuer', 'Issuing body', rules: ['required', 'string', 'max:255']),
                    Field::make('year', 'Year', rules: ['nullable', 'string', 'max:255']),
                    Field::make('credential_url', 'Credential URL', Field::URL, ['nullable', 'url', 'max:255']),
                ],
            ),

            new Resource(
                key: 'gear',
                model: GearItem::class,
                singular: 'Gear item',
                plural: 'Gear',
                description: 'Camera, lenses and editing tools on the photographer path.',
                columns: ['category', 'value'],
                fields: [
                    Field::make('category', 'Heading', rules: ['required', 'string', 'max:255'], help: 'e.g. Camera, Lenses, Editing.'),
                    Field::make('value', 'Detail', rules: ['required', 'string', 'max:255']),
                ],
            ),

            new Resource(
                key: 'tech-stacks',
                model: TechStack::class,
                singular: 'Tech stack item',
                plural: 'Tech stack',
                description: 'Icons shown in the tech stack grid.',
                columns: ['group', 'name', 'icon_slug'],
                fields: [
                    Field::make('group', 'Group', rules: ['required', 'string', 'max:255'], help: 'Items are grouped into one card per heading.'),
                    Field::make('name', 'Name', rules: ['required', 'string', 'max:255']),
                    Field::make('icon_slug', 'Icon slug', rules: ['nullable', 'string', 'max:255'], help: 'Simple Icons slug, e.g. "laravel". Unknown slugs just show the label.'),
                ],
            ),

            new Resource(
                key: 'tags',
                model: Tag::class,
                singular: 'Tag',
                plural: 'Teaser tags',
                description: 'The pill row above the first section of each path.',
                columns: ['label', 'path'],
                fields: [
                    Field::make('label', 'Label', rules: ['required', 'string', 'max:255']),
                    Field::make('path', 'Path', Field::SELECT, ['required', 'in:dev,photo'], $pathOptions),
                ],
            ),

            new Resource(
                key: 'stats',
                model: Stat::class,
                singular: 'Stat',
                plural: 'Welcome stats',
                description: 'The numbers on the welcome screen.',
                columns: ['value', 'label'],
                fields: [
                    Field::make('value', 'Value', rules: ['required', 'string', 'max:255'], help: 'Shown verbatim, e.g. "5+".'),
                    Field::make('label', 'Label', rules: ['required', 'string', 'max:255']),
                ],
            ),

            new Resource(
                key: 'contact-links',
                model: ContactLink::class,
                singular: 'Contact link',
                plural: 'Contact links',
                columns: ['label', 'url', 'path'],
                fields: [
                    Field::make('label', 'Label', rules: ['required', 'string', 'max:255']),
                    Field::make('url', 'URL', rules: ['required', 'string', 'max:255'], help: 'A full URL, or mailto:you@example.com.'),
                    Field::make('path', 'Path', Field::SELECT, ['required', 'in:dev,photo'], $pathOptions),
                ],
            ),

            new Resource(
                key: 'gallery-photos',
                model: GalleryPhoto::class,
                singular: 'Photo',
                plural: 'Gallery',
                description: 'Photos and the category their filter button uses.',
                // Thumbnail first: it is the only way to tell photos apart at a glance.
                columns: ['image', 'title', 'category'],
                fields: [
                    Field::make('image', 'Photo', Field::IMAGE, ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:8192'], help: 'JPEG, PNG or WebP, up to 8 MB.'),
                    Field::make('title', 'Title', rules: ['nullable', 'string', 'max:255']),
                    Field::make('caption', 'Caption', Field::TEXTAREA),
                    Field::make('category', 'Category', Field::SELECT, ['required', 'in:'.implode(',', GalleryPhoto::CATEGORIES)], array_map(
                        fn (string $c) => ['value' => $c, 'label' => ucfirst($c)],
                        GalleryPhoto::CATEGORIES,
                    )),
                ],
            ),
        ];
    }
}
