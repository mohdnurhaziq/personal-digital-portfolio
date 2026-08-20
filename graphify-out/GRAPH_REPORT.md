# Graph Report - .  (2026-08-20)

## Corpus Check
- 304 files · ~87,404 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 878 nodes · 1118 edges · 229 communities (209 shown, 20 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Media Models and Validation|Media Models and Validation]]
- [[_COMMUNITY_Admin Controllers and Responses|Admin Controllers and Responses]]
- [[_COMMUNITY_Resume Upload Management|Resume Upload Management]]
- [[_COMMUNITY_Frontend Package Dependencies|Frontend Package Dependencies]]
- [[_COMMUNITY_Portfolio Layout and Scene|Portfolio Layout and Scene]]
- [[_COMMUNITY_Admin Resource CRUD|Admin Resource CRUD]]
- [[_COMMUNITY_Project Screenshot Management|Project Screenshot Management]]
- [[_COMMUNITY_Password Authentication Flows|Password Authentication Flows]]
- [[_COMMUNITY_Database Seeding|Database Seeding]]
- [[_COMMUNITY_Public Portfolio Tests|Public Portfolio Tests]]
- [[_COMMUNITY_Login Validation and Throttling|Login Validation and Throttling]]
- [[_COMMUNITY_Password and SSR Tests|Password and SSR Tests]]
- [[_COMMUNITY_Contact Interface Components|Contact Interface Components]]
- [[_COMMUNITY_Admin Resource Abstraction|Admin Resource Abstraction]]
- [[_COMMUNITY_Portfolio Path Transitions|Portfolio Path Transitions]]
- [[_COMMUNITY_Contact Form Processing|Contact Form Processing]]
- [[_COMMUNITY_Contact Email Delivery|Contact Email Delivery]]
- [[_COMMUNITY_Portfolio Product Vision|Portfolio Product Vision]]
- [[_COMMUNITY_Admin Access Control|Admin Access Control]]
- [[_COMMUNITY_Session Authentication Controllers|Session Authentication Controllers]]
- [[_COMMUNITY_Composer Project Metadata|Composer Project Metadata]]
- [[_COMMUNITY_Development PHP Dependencies|Development PHP Dependencies]]
- [[_COMMUNITY_Composer Lifecycle Scripts|Composer Lifecycle Scripts]]
- [[_COMMUNITY_Contact Message Administration|Contact Message Administration]]
- [[_COMMUNITY_Laravel Runtime Dependencies|Laravel Runtime Dependencies]]
- [[_COMMUNITY_Profile Settings Forms|Profile Settings Forms]]
- [[_COMMUNITY_Admin Field Definition|Admin Field Definition]]
- [[_COMMUNITY_Inertia Request Middleware|Inertia Request Middleware]]
- [[_COMMUNITY_Composer Plugin Configuration|Composer Plugin Configuration]]
- [[_COMMUNITY_JavaScript Path Configuration|JavaScript Path Configuration]]
- [[_COMMUNITY_Users Auth Feature|Users Auth Feature]]
- [[_COMMUNITY_User App Models|User App Models]]
- [[_COMMUNITY_Dropdown Content Drop|Dropdown Content Drop]]
- [[_COMMUNITY_App Service Provider|App Service Provider]]
- [[_COMMUNITY_Email Verification Be|Email Verification Be]]
- [[_COMMUNITY_Database Autoload Psr|Database Autoload Psr]]
- [[_COMMUNITY_Development Service Docker|Development Service Docker]]
- [[_COMMUNITY_Scene Portfolio Contents|Scene Portfolio Contents]]
- [[_COMMUNITY_Production Ssr Service|Production Ssr Service]]
- [[_COMMUNITY_Screenshot Strip Viewer|Screenshot Strip Viewer]]
- [[_COMMUNITY_Path Concerns Models|Path Concerns Models]]
- [[_COMMUNITY_Concerns Models Builder|Concerns Models Builder]]
- [[_COMMUNITY_Autoload Dev Psr|Autoload Dev Psr]]
- [[_COMMUNITY_Extra Laravel Dont|Extra Laravel Dont]]
- [[_COMMUNITY_Portfolio Concept Preview|Portfolio Concept Preview]]
- [[_COMMUNITY_Stack Icon Portfolio|Stack Icon Portfolio]]
- [[_COMMUNITY_Theme Portfolio Themes|Theme Portfolio Themes]]
- [[_COMMUNITY_Design Build Manage|Design Build Manage]]
- [[_COMMUNITY_Entrypoint Sh Script|Entrypoint Sh Script]]
- [[_COMMUNITY_Web Allow Crawlers|Web Allow Crawlers]]
- [[_COMMUNITY_Imported Claude Cowork|Imported Claude Cowork]]
- [[_COMMUNITY_Accessible Button Based|Accessible Button Based]]

## God Nodes (most connected - your core abstractions)
1. `User` - 46 edges
2. `TestCase` - 40 edges
3. `SiteSetting` - 32 edges
4. `Controller` - 29 edges
5. `Model` - 27 edges
6. `Project` - 24 edges
7. `GalleryPhoto` - 20 edges
8. `ResourceController` - 15 edges
9. `PortfolioContentSeeder` - 15 edges
10. `ResourceCrudTest` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Database-Driven Content` --conceptually_related_to--> `Owner-Only CMS`  [INFERRED]
  development-todo.md → README.md
- `Persistent Inertia Layout` --rationale_for--> `Aperture Wipe and Matrix Rain Preview`  [INFERRED]
  development-todo.md → design/portfolio-preview-v3.html
- `PortfolioLayout()` --calls--> `usePrefersReducedMotion()`  [INFERRED]
  resources/js/Layouts/PortfolioLayout.jsx → resources/js/Components/Portfolio/usePrefersReducedMotion.js
- `Personal Portfolio` --references--> `Portfolio Development Build Checklist`  [EXTRACTED]
  README.md → development-todo.md
- `Personal Portfolio` --references--> `Personal Portfolio Plan`  [EXTRACTED]
  README.md → portfolio-plan.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Portfolio Design Evolution** — design_design_preview_portfolio_design_preview, design_design_preview_3d_3d_portfolio_preview, design_portfolio_preview_v2_cinematic_fork, design_portfolio_preview_v3_aperture_matrix_preview, design_portfolio_preview_v4_navy_blue_gold_preview [INFERRED 0.95]
- **Dual Path Portfolio Experience** — design_path_options_preview_split_hero_fork, design_portfolio_preview_v3_aperture_transition, design_portfolio_preview_v3_matrix_transition, design_portfolio_preview_v4_path_themed_cursor [INFERRED 0.85]
- **Docker and MySQL Runtime Architecture** — readme_docker_only_mysql_runtime, docker_compose_local_development_stack, docker_compose_prod_production_stack [INFERRED 0.95]

## Communities (229 total, 20 thin omitted)

### Community 0 - "Media Models and Validation"
Cohesion: 0.05
Nodes (31): Model, Response, Builder, Media, Builder, Media, Collection, Media (+23 more)

### Community 1 - "Admin Controllers and Responses"
Cohesion: 0.05
Nodes (37): DashboardController, MessagesController, Response, ContactMessage, RedirectResponse, Response, RedirectResponse, Request (+29 more)

### Community 2 - "Resume Upload Management"
Cohesion: 0.10
Nodes (16): ResumeUploadTest, SettingsController, Collection, RedirectResponse, Request, Response, RedirectResponse, BinaryFileResponse (+8 more)

### Community 3 - "Frontend Package Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, @fontsource-variable/bricolage-grotesque, @fontsource-variable/inter, @fontsource-variable/jetbrains-mono, gsap, @inertiajs/react, react, react-dom (+21 more)

### Community 4 - "Portfolio Layout and Scene"
Cohesion: 0.09
Nodes (17): PortfolioContext, PortfolioLayout(), usePortfolio(), BackgroundScene(), Scene, useSceneProfile(), CustomCursor(), HeroPolaroids() (+9 more)

### Community 5 - "Admin Resource CRUD"
Cohesion: 0.19
Nodes (7): AdminResources, ResourceController, Resource, RedirectResponse, Request, Resource, Response

### Community 6 - "Project Screenshot Management"
Cohesion: 0.17
Nodes (4): ProjectScreenshotsTest, ResourceCrudTest, Project, TestResponse

### Community 7 - "Password Authentication Flows"
Cohesion: 0.14
Nodes (4): PasswordConfirmationTest, PasswordResetTest, ProfileTest, User

### Community 8 - "Database Seeding"
Cohesion: 0.18
Nodes (3): Seeder, DatabaseSeeder, PortfolioContentSeeder

### Community 9 - "Public Portfolio Tests"
Cohesion: 0.12
Nodes (5): BaseTestCase, PortfolioPagesTest, TestEnvironmentTest, TestCase, ExampleTest

### Community 10 - "Login Validation and Throttling"
Cohesion: 0.16
Nodes (4): LoginRequest, FormRequest, ProfileUpdateRequest, StoreContactMessageRequest

### Community 11 - "Password and SSR Tests"
Cohesion: 0.16
Nodes (4): PasswordUpdateTest, ExampleTest, SsrSupportTest, RefreshDatabase

### Community 12 - "Contact Interface Components"
Cohesion: 0.27
Nodes (4): spans, ContactForm(), Reveal(), Section()

### Community 14 - "Portfolio Path Transitions"
Cohesion: 0.18
Nodes (11): Three Path Structure Options, Option C Persistent Toggle, Option B Separate Modes, Option A Split Hero Fork, Black and Gold Cinematic Fork, Iris-Wipe Transition, Aperture Wipe and Matrix Rain Preview, Photographer Aperture Transition (+3 more)

### Community 16 - "Contact Email Delivery"
Cohesion: 0.31
Nodes (6): Content, Envelope, ContactMessageReceived, Mailable, Queueable, SerializesModels

### Community 17 - "Portfolio Product Vision"
Cohesion: 0.24
Nodes (10): Filterable Photography Gallery, Navy Blue and Gold Portfolio Preview, Path-Themed Cursor, Welcome-to-Fork Crossfade, Database-Driven Content, Portfolio Development Build Checklist, Personal Portfolio Plan, Developer Project Manager Photographer Brand (+2 more)

### Community 19 - "Session Authentication Controllers"
Cohesion: 0.36
Nodes (5): RedirectResponse, Request, Response, AuthenticatedSessionController, LoginRequest

### Community 20 - "Composer Project Metadata"
Cohesion: 0.22
Nodes (8): description, keywords, license, minimum-stability, name, prefer-stable, $schema, type

### Community 21 - "Development PHP Dependencies"
Cohesion: 0.22
Nodes (9): require-dev, fakerphp/faker, laravel/breeze, laravel/pail, laravel/pao, laravel/pint, mockery/mockery, nunomaduro/collision (+1 more)

### Community 22 - "Composer Lifecycle Scripts"
Cohesion: 0.22
Nodes (9): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, pre-package-uninstall, setup (+1 more)

### Community 24 - "Laravel Runtime Dependencies"
Cohesion: 0.25
Nodes (8): require, inertiajs/inertia-laravel, laravel/framework, laravel/sanctum, laravel/tinker, php, spatie/laravel-medialibrary, tightenco/ziggy

### Community 25 - "Profile Settings Forms"
Cohesion: 0.36
Nodes (3): DeleteUserForm(), UpdatePasswordForm(), UpdateProfileInformation()

### Community 27 - "Inertia Request Middleware"
Cohesion: 0.43
Nodes (3): Request, Middleware, HandleInertiaRequests

### Community 28 - "Composer Plugin Configuration"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 29 - "JavaScript Path Configuration"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, paths, exclude, @/*, ziggy-js

### Community 31 - "User App Models"
Cohesion: 0.47
Nodes (4): Authenticatable, HasFactory, User, Notifiable

### Community 35 - "Database Autoload Psr"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 36 - "Development Service Docker"
Cohesion: 0.60
Nodes (5): Development App Service, Local Docker Development Stack, MySQL Development Service, Vite Service, Docker-Only MySQL Runtime

### Community 40 - "Production Ssr Service"
Cohesion: 0.67
Nodes (4): Production App and SSR Service, MySQL Production Service, Production-Shaped Docker Stack, Production SSR Verification

### Community 45 - "Autoload Dev Psr"
Cohesion: 0.67
Nodes (3): autoload-dev, psr-4, Tests\\

### Community 46 - "Extra Laravel Dont"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

### Community 48 - "Portfolio Concept Preview"
Cohesion: 0.67
Nodes (3): 3D Portfolio Concept Preview, Persistent WebGL Scene, Motion Performance and Accessibility

## Knowledge Gaps
- **98 isolated node(s):** `Resource`, `self`, `self`, `$schema`, `name` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Controller` connect `Admin Controllers and Responses` to `Media Models and Validation`, `Resume Upload Management`, `Session Authentication Controllers`, `Admin Resource CRUD`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `SiteSetting` connect `Resume Upload Management` to `Media Models and Validation`, `Project Screenshot Management`, `Database Seeding`, `Public Portfolio Tests`, `Contact Form Processing`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `User` connect `Password Authentication Flows` to `Media Models and Validation`, `Resume Upload Management`, `Email Verification Be`, `Project Screenshot Management`, `Database Seeding`, `Login Validation and Throttling`, `Password and SSR Tests`, `Admin Access Control`, `Contact Message Administration`, `Users Auth Feature`, `User App Models`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `Resource`, `self`, `self` to the rest of the system?**
  _104 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Media Models and Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.05154320987654321 - nodes in this community are weakly interconnected._
- **Should `Admin Controllers and Responses` be split into smaller, more focused modules?**
  _Cohesion score 0.050595238095238096 - nodes in this community are weakly interconnected._
- **Should `Resume Upload Management` be split into smaller, more focused modules?**
  _Cohesion score 0.0975609756097561 - nodes in this community are weakly interconnected._