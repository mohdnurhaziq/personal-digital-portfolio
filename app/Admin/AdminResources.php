<?php

namespace App\Admin;

use App\Models\Certification;
use App\Models\ContactLink;
use App\Models\Experience;
use App\Models\GalleryPhoto;
use App\Models\GearItem;
use App\Models\PhotoCategory;
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
     * Common development, infrastructure, design and delivery tools available
     * in the admin dropdown. Values are Simple Icons slugs; AWS is handled by
     * the portfolio's local Font Awesome fallback.
     *
     * @var array<string, string>
     */
    private const TECH_STACKS = [
        'adobephotoshop' => 'Adobe Photoshop',
        'alpinedotjs' => 'Alpine.js',
        'android' => 'Android',
        'angular' => 'Angular',
        'ansible' => 'Ansible',
        'apache' => 'Apache',
        'apachekafka' => 'Apache Kafka',
        'asana' => 'Asana',
        'amazonaws' => 'AWS',
        'amazondynamodb' => 'AWS DynamoDB',
        'amazonec2' => 'AWS EC2',
        'amazons3' => 'AWS S3',
        'bootstrap' => 'Bootstrap',
        'bun' => 'Bun',
        'c' => 'C',
        'cplusplus' => 'C++',
        'clickup' => 'ClickUp',
        'cloudflare' => 'Cloudflare',
        'codeigniter' => 'CodeIgniter',
        'composer' => 'Composer',
        'css' => 'CSS',
        'deno' => 'Deno',
        'digitalocean' => 'DigitalOcean',
        'docker' => 'Docker',
        'dotnet' => '.NET',
        'electron' => 'Electron',
        'elasticsearch' => 'Elasticsearch',
        'express' => 'Express',
        'figma' => 'Figma',
        'firebase' => 'Firebase',
        'git' => 'Git',
        'github' => 'GitHub',
        'githubactions' => 'GitHub Actions',
        'gitlab' => 'GitLab',
        'go' => 'Go',
        'googlecloud' => 'Google Cloud',
        'grafana' => 'Grafana',
        'graphql' => 'GraphQL',
        'html5' => 'HTML5',
        'inertia' => 'Inertia.js',
        'insomnia' => 'Insomnia',
        'javascript' => 'JavaScript',
        'jenkins' => 'Jenkins',
        'jira' => 'Jira',
        'jquery' => 'jQuery',
        'kubernetes' => 'Kubernetes',
        'laravel' => 'Laravel',
        'linear' => 'Linear',
        'linux' => 'Linux',
        'livewire' => 'Livewire',
        'mariadb' => 'MariaDB',
        'microsoftazure' => 'Microsoft Azure',
        'microsoftteams' => 'Microsoft Teams',
        'mongodb' => 'MongoDB',
        'mui' => 'MUI',
        'mysql' => 'MySQL',
        'nestdotjs' => 'NestJS',
        'nextdotjs' => 'Next.js',
        'nginx' => 'NGINX',
        'nodedotjs' => 'Node.js',
        'notion' => 'Notion',
        'npm' => 'npm',
        'nuxt' => 'Nuxt',
        'openjdk' => 'Java / OpenJDK',
        'php' => 'PHP',
        'pnpm' => 'pnpm',
        'postgresql' => 'PostgreSQL',
        'postman' => 'Postman',
        'prometheus' => 'Prometheus',
        'python' => 'Python',
        'rabbitmq' => 'RabbitMQ',
        'react' => 'React',
        'redis' => 'Redis',
        'rust' => 'Rust',
        'sass' => 'Sass',
        'slack' => 'Slack',
        'sqlite' => 'SQLite',
        'supabase' => 'Supabase',
        'swagger' => 'Swagger',
        'symfony' => 'Symfony',
        'tailwindcss' => 'Tailwind CSS',
        'terraform' => 'Terraform',
        'threedotjs' => 'Three.js',
        'trello' => 'Trello',
        'typescript' => 'TypeScript',
        'ubuntu' => 'Ubuntu',
        'valkey' => 'Valkey',
        'vercel' => 'Vercel',
        'vite' => 'Vite',
        'vuedotjs' => 'Vue.js',
        'wordpress' => 'WordPress',
        'yarn' => 'Yarn',
    ];

    /**
     * @return array<string, resource>
     */
    public static function all(): array
    {
        // Definitions include database-backed photo category options. Building
        // them per request keeps a newly added category available immediately,
        // including under long-running PHP workers.
        return collect(self::definitions())
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
                navSection: 'dev',
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
                    Field::make(
                        'screenshots',
                        'Screenshots',
                        Field::IMAGES,
                        ['nullable', 'array'],
                        help: 'JPEG, PNG or WebP, up to 8 MB each. The first one is the card image — reorder to change which.',
                        collection: Project::COLLECTION,
                        itemRules: ['image', 'mimes:jpeg,jpg,png,webp', 'max:8192'],
                    ),
                ],
            ),

            new Resource(
                key: 'experiences',
                model: Experience::class,
                singular: 'Role',
                plural: 'Experience',
                description: 'Work history timeline.',
                columns: ['title', 'company', 'date_range'],
                navSection: 'dev',
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
                description: 'Published recommendations and anonymous submissions awaiting review.',
                columns: ['author_name', 'author_company', 'status'],
                navSection: 'dev',
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
                columns: ['attachment', 'name', 'issuer', 'year'],
                navSection: 'dev',
                fields: [
                    Field::make(
                        'attachment',
                        'Certificate file',
                        Field::FILE,
                        ['nullable', 'file', 'mimes:pdf,jpeg,jpg,png,webp', 'max:10240'],
                        help: 'PDF, JPEG, PNG or WebP, up to 10 MB. Uploading again replaces the current file.',
                        collection: Certification::COLLECTION,
                        accept: 'application/pdf,image/jpeg,image/png,image/webp',
                    ),
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
                navSection: 'photo',
                columns: ['image', 'category', 'value'],
                fields: [
                    Field::make('image', 'Photo', Field::IMAGE, ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:8192'], help: 'JPEG, PNG or WebP, up to 8 MB.', collection: GearItem::COLLECTION),
                    Field::make('category', 'Heading', rules: ['required', 'string', 'max:255'], help: 'e.g. Camera, Lenses, Editing.'),
                    Field::make('value', 'Detail', rules: ['required', 'string', 'max:255']),
                ],
            ),

            new Resource(
                key: 'photo-categories',
                model: PhotoCategory::class,
                singular: 'Photo category',
                plural: 'Photo categories',
                description: 'Filter categories available when adding photos to the gallery.',
                navSection: 'photo',
                columns: ['name'],
                fields: [
                    Field::make('name', 'Name', rules: ['required', 'string', 'max:80'], help: 'The URL-safe category value is generated automatically.'),
                ],
            ),

            new Resource(
                key: 'tech-stacks',
                model: TechStack::class,
                singular: 'Tech stack item',
                plural: 'Tech stack',
                description: 'Icons shown in the tech stack grid.',
                navSection: 'dev',
                columns: ['group', 'name', 'icon_slug'],
                fields: [
                    Field::make('group', 'Group', rules: ['required', 'string', 'max:255'], help: 'Items are grouped into one card per heading.'),
                    Field::make(
                        'icon_slug',
                        'Technology',
                        Field::SELECT,
                        ['required', 'string', 'in:'.implode(',', array_keys(self::TECH_STACKS))],
                        self::techStackOptions(),
                        'Choose the technology; its display name, icon and official brand colour are applied automatically.',
                        searchable: true,
                    ),
                ],
            ),

            new Resource(
                key: 'tags',
                model: Tag::class,
                singular: 'Tag',
                plural: 'Teaser tags',
                description: 'The pill row above the first section of each path.',
                navSection: 'shared',
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
                navSection: 'site',
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
                navSection: 'shared',
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
                navSection: 'photo',
                // Thumbnail first: it is the only way to tell photos apart at a glance.
                columns: ['image', 'title', 'category'],
                fields: [
                    Field::make('image', 'Photo', Field::IMAGE, ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:8192'], help: 'JPEG, PNG or WebP, up to 8 MB.', collection: GalleryPhoto::COLLECTION),
                    Field::make('title', 'Title', rules: ['nullable', 'string', 'max:255']),
                    Field::make('caption', 'Caption', Field::TEXTAREA),
                    Field::make(
                        'category',
                        'Category',
                        Field::SELECT,
                        ['required', 'exists:photo_categories,slug'],
                        self::photoCategoryOptions(),
                        'Manage these options under Photographer → Photo categories.',
                    ),
                ],
            ),
        ];
    }

    /**
     * Each option carries server-side companion values. ResourceController
     * applies them when the selection is saved, so name and icon cannot drift.
     *
     * @return array<int, array<string, mixed>>
     */
    private static function techStackOptions(): array
    {
        return collect(self::TECH_STACKS)
            ->map(fn (string $name, string $slug) => [
                'value' => $slug,
                'label' => $name,
                'set' => ['name' => $name],
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private static function photoCategoryOptions(): array
    {
        return PhotoCategory::ordered()
            ->get(['name', 'slug'])
            ->map(fn (PhotoCategory $category) => [
                'value' => $category->slug,
                'label' => $category->name,
            ])
            ->all();
    }
}
