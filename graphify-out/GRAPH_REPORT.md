# Graph Report - .  (2026-08-20)

## Corpus Check
- 13 files · ~57,922 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 805 nodes · 1156 edges · 127 communities (107 shown, 20 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Media Models and Validation|Media Models and Validation]]
- [[_COMMUNITY_Admin Controllers and Responses|Admin Controllers and Responses]]
- [[_COMMUNITY_Resume Upload Management|Resume Upload Management]]
- [[_COMMUNITY_Frontend Package Dependencies|Frontend Package Dependencies]]
- [[_COMMUNITY_Portfolio Layout and Scene|Portfolio Layout and Scene]]
- [[_COMMUNITY_Admin Resource CRUD|Admin Resource CRUD]]
- [[_COMMUNITY_Project Screenshot Management|Project Screenshot Management]]
- [[_COMMUNITY_CI and Runtime Configuration|CI and Runtime Configuration]]
- [[_COMMUNITY_Login Validation and Throttling|Login Validation and Throttling]]
- [[_COMMUNITY_Database Seeding|Database Seeding]]
- [[_COMMUNITY_Public Portfolio Tests|Public Portfolio Tests]]
- [[_COMMUNITY_Contact Interface Components|Contact Interface Components]]
- [[_COMMUNITY_Password and SSR Tests|Password and SSR Tests]]
- [[_COMMUNITY_Admin Resource Abstraction|Admin Resource Abstraction]]
- [[_COMMUNITY_User App Models|User App Models]]
- [[_COMMUNITY_Portfolio Path Transitions|Portfolio Path Transitions]]
- [[_COMMUNITY_Contact Form Processing|Contact Form Processing]]
- [[_COMMUNITY_Contact Email Delivery|Contact Email Delivery]]
- [[_COMMUNITY_Portfolio Product Vision|Portfolio Product Vision]]
- [[_COMMUNITY_Admin Access Control|Admin Access Control]]
- [[_COMMUNITY_Media Models and Validation|Media Models and Validation]]
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
- [[_COMMUNITY_Dropdown Content Drop|Dropdown Content Drop]]
- [[_COMMUNITY_App Service Provider|App Service Provider]]
- [[_COMMUNITY_Email Verification Be|Email Verification Be]]
- [[_COMMUNITY_Database Autoload Psr|Database Autoload Psr]]
- [[_COMMUNITY_Development Service Docker|Development Service Docker]]
- [[_COMMUNITY_Password Authentication Flows|Password Authentication Flows]]
- [[_COMMUNITY_Scene Portfolio Contents|Scene Portfolio Contents]]
- [[_COMMUNITY_Run Portfolio Transitions|Run Portfolio Transitions]]
- [[_COMMUNITY_Browser Smoke Tests|Browser Smoke Tests]]
- [[_COMMUNITY_Settings Admin Pages|Settings Admin Pages]]
- [[_COMMUNITY_Screenshot Strip Viewer|Screenshot Strip Viewer]]
- [[_COMMUNITY_Password Authentication Flows|Password Authentication Flows]]
- [[_COMMUNITY_Autoload Dev Psr|Autoload Dev Psr]]
- [[_COMMUNITY_Extra Laravel Dont|Extra Laravel Dont]]
- [[_COMMUNITY_Image Concerns Models|Image Concerns Models]]
- [[_COMMUNITY_Portfolio Concept Preview|Portfolio Concept Preview]]
- [[_COMMUNITY_Database Migrations Create|Database Migrations Create]]
- [[_COMMUNITY_Database Migrations Create|Database Migrations Create]]
- [[_COMMUNITY_Production Launch Gaps|Production Launch Gaps]]
- [[_COMMUNITY_Concerns Models Builder|Concerns Models Builder]]
- [[_COMMUNITY_Dashboard Admin Pages|Dashboard Admin Pages]]
- [[_COMMUNITY_Messages Admin Pages|Messages Admin Pages]]
- [[_COMMUNITY_Admin Layout Layouts|Admin Layout Layouts]]
- [[_COMMUNITY_Authenticated Layout Layouts|Authenticated Layout Layouts]]
- [[_COMMUNITY_Packages Bootstrap Cache|Packages Bootstrap Cache]]
- [[_COMMUNITY_Text Input|Text Input]]

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
- `Automated Browser and CI Gap` --semantically_similar_to--> `Continuous Integration`  [INFERRED] [semantically similar]
  graphify-out/memory/query_20260820_073932_any_more_gap_need_to_be_field.md → development-todo.md
- `Mobile Three.js Recommendation` --semantically_similar_to--> `Mobile Three.js Performance Tradeoff`  [INFERRED] [semantically similar]
  graphify-out/memory/query_20260820_074945_why_i_need_to_disable_the_three_js_on_phone.md → development-todo.md
- `Production Hardening Priority` --semantically_similar_to--> `Production Launch Gaps`  [INFERRED] [semantically similar]
  graphify-out/memory/query_20260820_070944_what_s_next.md → development-todo.md
- `CI Pipeline` --implements--> `Continuous Integration`  [INFERRED]
  .github/workflows/ci.yml → development-todo.md
- `Browser Smoke Tests` --references--> `Playwright Browser Matrix`  [INFERRED]
  README.md → .github/workflows/ci.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Automated Quality Gate** — workflows_ci_ci_pipeline, workflows_ci_playwright_browser_matrix, development_todo_continuous_integration, development_todo_cross_browser_smoke_check, readme_browser_smoke_tests [INFERRED 0.95]
- **Isolated MySQL Browser Testing** — workflows_ci_isolated_test_environment, readme_mutation_safety_gate, readme_mysql_test_isolation, docker_compose_portfolio_test_database [INFERRED 0.95]
- **Remaining Launch Readiness** — development_todo_outstanding_device_validation, development_todo_production_launch_gaps, development_todo_real_content_replacement [INFERRED 0.85]

## Communities (127 total, 20 thin omitted)

### Community 0 - "Media Models and Validation"
Cohesion: 0.06
Nodes (32): DashboardController, MessagesController, Response, ContactMessage, RedirectResponse, Response, RedirectResponse, Request (+24 more)

### Community 1 - "Admin Controllers and Responses"
Cohesion: 0.09
Nodes (16): Resource, Model, Response, BelongsToPath, PortfolioController, HasSortOrder, Certification, ContactLink (+8 more)

### Community 2 - "Resume Upload Management"
Cohesion: 0.08
Nodes (16): Builder, Media, Builder, Media, Collection, Media, self, UserFactory (+8 more)

### Community 3 - "Frontend Package Dependencies"
Cohesion: 0.10
Nodes (16): ResumeUploadTest, SettingsController, Collection, RedirectResponse, Request, Response, RedirectResponse, BinaryFileResponse (+8 more)

### Community 4 - "Portfolio Layout and Scene"
Cohesion: 0.06
Nodes (34): dependencies, @fontsource-variable/bricolage-grotesque, @fontsource-variable/inter, @fontsource-variable/jetbrains-mono, gsap, @inertiajs/react, react, react-dom (+26 more)

### Community 5 - "Admin Resource CRUD"
Cohesion: 0.11
Nodes (5): ProjectScreenshotsTest, ResourceCrudTest, PortfolioContentSeederTest, Project, TestResponse

### Community 6 - "Project Screenshot Management"
Cohesion: 0.09
Nodes (17): PortfolioContext, PortfolioLayout(), usePortfolio(), BackgroundScene(), Scene, useSceneProfile(), CustomCursor(), HeroPolaroids() (+9 more)

### Community 7 - "CI and Runtime Configuration"
Cohesion: 0.11
Nodes (23): Accessible Reordering Validation, Continuous Integration, Cross-Browser Smoke Check, Mobile Three.js Performance Tradeoff, Outstanding Device and Assistive Technology Validation, Local Development Stack, MySQL 8.4 Service, No SSR in Development (+15 more)

### Community 8 - "Login Validation and Throttling"
Cohesion: 0.15
Nodes (4): EmailVerificationTest, PasswordConfirmationTest, ProfileTest, User

### Community 9 - "Database Seeding"
Cohesion: 0.26
Nodes (6): ResourceController, RedirectResponse, Request, Resource, Response, Field

### Community 10 - "Public Portfolio Tests"
Cohesion: 0.16
Nodes (4): LoginRequest, FormRequest, ProfileUpdateRequest, StoreContactMessageRequest

### Community 11 - "Contact Interface Components"
Cohesion: 0.19
Nodes (5): AdminResources, Resource, Request, Middleware, HandleInertiaRequests

### Community 12 - "Password and SSR Tests"
Cohesion: 0.19
Nodes (5): BaseTestCase, ExampleTest, TestEnvironmentTest, TestCase, ExampleTest

### Community 13 - "Admin Resource Abstraction"
Cohesion: 0.27
Nodes (4): spans, ContactForm(), Reveal(), Section()

### Community 14 - "User App Models"
Cohesion: 0.20
Nodes (3): PasswordUpdateTest, SsrSupportTest, RefreshDatabase

### Community 16 - "Contact Form Processing"
Cohesion: 0.31
Nodes (6): Content, Envelope, ContactMessageReceived, Mailable, Queueable, SerializesModels

### Community 17 - "Contact Email Delivery"
Cohesion: 0.20
Nodes (10): Three Path Structure Options, Option C Persistent Toggle, Option B Separate Modes, Option A Split Hero Fork, Black and Gold Cinematic Fork, Iris-Wipe Transition, Aperture Wipe and Matrix Rain Preview, Photographer Aperture Transition (+2 more)

### Community 19 - "Admin Access Control"
Cohesion: 0.36
Nodes (5): RedirectResponse, Request, Response, AuthenticatedSessionController, LoginRequest

### Community 20 - "Media Models and Validation"
Cohesion: 0.39
Nodes (5): RedirectResponse, Request, Response, ProfileController, ProfileUpdateRequest

### Community 21 - "Composer Project Metadata"
Cohesion: 0.22
Nodes (8): description, keywords, license, minimum-stability, name, prefer-stable, $schema, type

### Community 22 - "Development PHP Dependencies"
Cohesion: 0.22
Nodes (9): require-dev, fakerphp/faker, laravel/breeze, laravel/pail, laravel/pao, laravel/pint, mockery/mockery, nunomaduro/collision (+1 more)

### Community 23 - "Composer Lifecycle Scripts"
Cohesion: 0.22
Nodes (9): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, pre-package-uninstall, setup (+1 more)

### Community 24 - "Contact Message Administration"
Cohesion: 0.43
Nodes (4): EMPTY_IMAGES, focusDirectionAfterMove(), movedStatus(), moveItem()

### Community 26 - "Profile Settings Forms"
Cohesion: 0.25
Nodes (8): require, inertiajs/inertia-laravel, laravel/framework, laravel/sanctum, laravel/tinker, php, spatie/laravel-medialibrary, tightenco/ziggy

### Community 28 - "Inertia Request Middleware"
Cohesion: 0.36
Nodes (3): DeleteUserForm(), UpdatePasswordForm(), UpdateProfileInformation()

### Community 30 - "JavaScript Path Configuration"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 31 - "Dropdown Content Drop"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, paths, exclude, @/*, ziggy-js

### Community 34 - "Database Autoload Psr"
Cohesion: 0.47
Nodes (4): Authenticatable, HasFactory, User, Notifiable

### Community 36 - "Password Authentication Flows"
Cohesion: 0.33
Nodes (6): Filterable Photography Gallery, Navy Blue and Gold Portfolio Preview, Path-Themed Cursor, Welcome-to-Fork Crossfade, Personal Portfolio Plan, Developer Project Manager Photographer Brand

### Community 39 - "Browser Smoke Tests"
Cohesion: 0.50
Nodes (3): logIn(), publicPages, visit()

### Community 40 - "Settings Admin Pages"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 44 - "Password Authentication Flows"
Cohesion: 0.50
Nodes (4): Accessible Reordering Traceability Gap, Motion Accessibility Traceability Gap, Production Hardening Evidence Gap, Project Gap Analysis

### Community 48 - "Portfolio Concept Preview"
Cohesion: 0.67
Nodes (3): autoload-dev, psr-4, Tests\\

### Community 49 - "Database Migrations Create"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

### Community 51 - "Database Migrations Create"
Cohesion: 0.67
Nodes (3): 3D Portfolio Concept Preview, Persistent WebGL Scene, Motion Performance and Accessibility

### Community 52 - "Production Launch Gaps"
Cohesion: 0.67
Nodes (3): Production Launch Gaps, Real Content Replacement, Production Hardening Priority

### Community 53 - "Concerns Models Builder"
Cohesion: 1.00
Nodes (3): Production App and SSR Service, MySQL Production Service, Production-Shaped Docker Stack

## Knowledge Gaps
- **109 isolated node(s):** `Resource`, `self`, `self`, `$schema`, `name` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Controller` connect `Media Models and Validation` to `Admin Controllers and Responses`, `Frontend Package Dependencies`, `Database Seeding`, `Admin Access Control`, `Media Models and Validation`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `SiteSetting` connect `Frontend Package Dependencies` to `Admin Controllers and Responses`, `Admin Resource CRUD`, `Run Portfolio Transitions`, `Portfolio Path Transitions`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `User` connect `Login Validation and Throttling` to `App Service Provider`, `Email Verification Be`, `Resume Upload Management`, `Frontend Package Dependencies`, `Database Autoload Psr`, `Admin Resource CRUD`, `Run Portfolio Transitions`, `Public Portfolio Tests`, `User App Models`, `Portfolio Product Vision`, `Laravel Runtime Dependencies`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `Resource`, `self`, `self` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Media Models and Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.05858585858585859 - nodes in this community are weakly interconnected._
- **Should `Admin Controllers and Responses` be split into smaller, more focused modules?**
  _Cohesion score 0.08563134978229318 - nodes in this community are weakly interconnected._
- **Should `Resume Upload Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07781649245063879 - nodes in this community are weakly interconnected._