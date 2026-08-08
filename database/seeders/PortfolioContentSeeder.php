<?php

namespace Database\Seeders;

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
use Illuminate\Database\Seeder;

/**
 * Mirrors the placeholder content in design/portfolio-preview-v4.html so the
 * Inertia pages render exactly like the static reference before real content
 * lands. Re-runnable: every table is truncated first.
 */
class PortfolioContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->truncate();

        $this->seedSettings();
        $this->seedStats();
        $this->seedTags();
        $this->seedTechStacks();
        $this->seedProjects();
        $this->seedExperiences();
        $this->seedTestimonials();
        $this->seedCertifications();
        $this->seedGear();
        $this->seedGallery();
        $this->seedContactLinks();
    }

    private function truncate(): void
    {
        foreach ([
            SiteSetting::class, Stat::class, Tag::class, TechStack::class,
            Project::class, Experience::class, Testimonial::class,
            Certification::class, GearItem::class, GalleryPhoto::class,
            ContactLink::class,
        ] as $model) {
            $model::query()->delete();
        }
    }

    private function seedSettings(): void
    {
        $settings = [
            // Welcome screen
            ['welcome_kicker', 'Portfolio — 2026', 'welcome', 'text', 'Kicker'],
            ['owner_name', 'Mohd. Nur Haziq Irsyamuddin', 'welcome', 'text', 'Full name'],
            ['brand_short', 'HAZIQ', 'welcome', 'text', 'Short brand (nav)'],
            ['welcome_tagline_lead', 'Programmer on the', 'welcome', 'text', 'Tagline — before "weekdays"'],
            ['welcome_tagline_mid', ', photographer on the', 'welcome', 'text', 'Tagline — between'],
            ['welcome_tagline_end', '.', 'welcome', 'text', 'Tagline — after "weekends"'],
            ['welcome_bio', 'I build products, ship code, and shoot photos in between. This is where both live — pick a path to see the work.', 'welcome', 'textarea', 'Welcome bio'],
            ['welcome_cta', 'Continue', 'welcome', 'text', 'CTA label'],

            // Weekday / programmer path
            ['dev_kicker', 'Weekdays', 'dev', 'text', 'Page kicker'],
            ['dev_heading', 'Programmer & project manager', 'dev', 'text', 'Page heading'],
            ['dev_intro', "I build products end to end and run the teams delivering them. Here's the skills and projects side of the split.", 'dev', 'textarea', 'Page intro'],
            ['dev_about_title', 'About', 'dev', 'text', 'About section title'],
            ['dev_about_bio', 'Placeholder bio — how you got into software and product management, what you care about building, and how you like to lead teams and ship products. Replace with your real story once you\'ve got it written.', 'dev', 'textarea', 'About bio'],
            ['dev_contact_lead', 'Open to new roles, freelance work, or just talking shop. Reach out.', 'dev', 'textarea', 'Contact lead'],
            ['resume_url', '#', 'dev', 'url', 'Resume PDF URL'],

            // Weekend / photographer path
            ['photo_kicker', 'Weekends', 'photo', 'text', 'Page kicker'],
            ['photo_heading', 'Photography', 'photo', 'text', 'Page heading'],
            ['photo_intro', 'Portraits and street work, shot on weekends. Gear list and a curated gallery below.', 'photo', 'textarea', 'Page intro'],
            ['photo_about_title', 'Behind the photos', 'photo', 'text', 'About section title'],
            ['photo_about_bio', 'Placeholder bio — what draws you to shooting on weekends, your style, how you got into it, gear philosophy. Replace with your real story once you\'ve got it written.', 'photo', 'textarea', 'About bio'],
            ['bookings_lead', 'Available for portrait sessions, events, and small collabs on weekends. Typical turnaround is 1–2 weeks for an edited gallery.', 'photo', 'textarea', 'Bookings blurb'],
            ['bookings_cta', 'Enquire about a shoot', 'photo', 'text', 'Bookings CTA label'],
            ['photo_contact_lead', 'Available for shoots, collabs, or just want to talk about cameras. Reach out.', 'photo', 'textarea', 'Contact lead'],

            // Shared
            ['contact_email', 'hello@ziq.dev', 'meta', 'email', 'Contact email'],
            ['meta_description', 'Portfolio of Mohd. Nur Haziq Irsyamuddin — programmer on the weekdays, photographer on the weekends.', 'meta', 'textarea', 'Meta description'],
        ];

        foreach ($settings as [$key, $value, $group, $type, $label]) {
            SiteSetting::create(compact('key', 'value', 'group', 'type', 'label'));
        }
    }

    private function seedStats(): void
    {
        foreach ([
            ['5+', 'Years experience'],
            ['20+', 'Projects shipped'],
            ['300+', 'Photos shot'],
        ] as $i => [$value, $label]) {
            Stat::create(['value' => $value, 'label' => $label, 'sort_order' => $i]);
        }
    }

    private function seedTags(): void
    {
        $tags = [
            'dev' => ['Laravel', 'React', 'Node.js', 'MySQL', 'Agile / Scrum', 'Jira', 'Stakeholder mgmt'],
            'photo' => ['Sony A7IV', '35mm f/1.4', '85mm f/1.8', 'Lightroom', 'Portrait', 'Street'],
        ];

        foreach ($tags as $path => $labels) {
            foreach ($labels as $i => $label) {
                Tag::create(['label' => $label, 'path' => $path, 'sort_order' => $i]);
            }
        }
    }

    private function seedTechStacks(): void
    {
        $groups = [
            'Languages & frameworks' => [
                ['Laravel', 'laravel'],
                ['React', 'react'],
                ['Node.js', 'nodedotjs'],
                ['TypeScript', 'typescript'],
                ['JavaScript', 'javascript'],
            ],
            'Data & infra' => [
                ['MySQL', 'mysql'],
                ['PostgreSQL', 'postgresql'],
                ['Redis', 'redis'],
                ['AWS', 'amazonaws'],
            ],
            'PM & tools' => [
                ['Jira', 'jira'],
                ['Notion', 'notion'],
                ['Figma', 'figma'],
            ],
        ];

        $groupOrder = 0;
        foreach ($groups as $group => $items) {
            foreach ($items as $i => [$name, $iconSlug]) {
                TechStack::create([
                    'group' => $group,
                    'name' => $name,
                    'icon_slug' => $iconSlug,
                    // Keeps groups themselves ordered as well as items within them.
                    'sort_order' => $groupOrder * 100 + $i,
                ]);
            }
            $groupOrder++;
        }
    }

    private function seedProjects(): void
    {
        foreach ([
            ['Project one', 'Problem, your role, outcome. Link to repo/demo goes here.', 'big'],
            ['Project two', 'Short description.', 'small'],
            ['Project three', 'Short description.', 'small'],
            ['Project four', 'Problem, your role, outcome.', 'big'],
        ] as $i => [$title, $description, $size]) {
            Project::create([
                'title' => $title,
                'description' => $description,
                'size' => $size,
                'sort_order' => $i,
            ]);
        }
    }

    private function seedExperiences(): void
    {
        foreach ([
            ['Job title', 'Company name', '2023 — Present'],
            ['Previous job title', 'Previous company', '2020 — 2023'],
        ] as $i => [$title, $company, $range]) {
            Experience::create([
                'title' => $title,
                'company' => $company,
                'date_range' => $range,
                'bullets' => [
                    'Achievement or responsibility one.',
                    'Achievement or responsibility two.',
                ],
                'sort_order' => $i,
            ]);
        }
    }

    private function seedTestimonials(): void
    {
        foreach ([
            '"Quote about working together — reliability, ownership, communication. Replace with a real recommendation."',
            '"Another quote — technical skill, leadership, or delivery under pressure. Replace with a real recommendation."',
        ] as $i => $quote) {
            Testimonial::create([
                'quote' => $quote,
                'author_name' => 'Name',
                'author_title' => 'Title',
                'author_company' => 'Company',
                'sort_order' => $i,
            ]);
        }
    }

    private function seedCertifications(): void
    {
        foreach (['2024', '2023', '2022'] as $i => $year) {
            Certification::create([
                'name' => 'Certification name',
                'issuer' => 'Issuing body',
                'year' => $year,
                'sort_order' => $i,
            ]);
        }
    }

    private function seedGear(): void
    {
        foreach ([
            ['Camera', 'Sony A7 IV'],
            ['Lenses', '35mm f/1.4 · 85mm f/1.8'],
            ['Editing', 'Lightroom · Capture One'],
        ] as $i => [$category, $value]) {
            GearItem::create([
                'category' => $category,
                'value' => $value,
                'sort_order' => $i,
            ]);
        }
    }

    private function seedGallery(): void
    {
        // Same eight tiles, in the same category order, as the preview grid.
        $categories = ['portrait', 'street', 'landscape', 'portrait', 'event', 'street', 'landscape', 'portrait'];

        foreach ($categories as $i => $category) {
            GalleryPhoto::create([
                'category' => $category,
                'sort_order' => $i,
            ]);
        }
    }

    private function seedContactLinks(): void
    {
        $email = SiteSetting::get('contact_email', 'hello@ziq.dev');

        $links = [
            'dev' => [
                [$email, 'mailto:'.$email],
                ['LinkedIn', '#'],
                ['GitHub', '#'],
            ],
            'photo' => [
                [$email, 'mailto:'.$email],
                ['Instagram', '#'],
            ],
        ];

        foreach ($links as $path => $items) {
            foreach ($items as $i => [$label, $url]) {
                ContactLink::create([
                    'label' => $label,
                    'url' => $url,
                    'path' => $path,
                    'sort_order' => $i,
                ]);
            }
        }
    }
}
