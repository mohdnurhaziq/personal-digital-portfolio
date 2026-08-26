<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MessagesController;
use App\Http\Controllers\Admin\ResourceController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TestimonialInvitationController as AdminTestimonialInvitationController;
use App\Http\Controllers\Admin\TestimonialModerationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResumeController;
use App\Http\Controllers\TestimonialInvitationController;
use Illuminate\Support\Facades\Route;

// Public portfolio. Each path gets a real URL so links are shareable — the
// cinematic transitions are layered on top of Inertia visits, not a substitute
// for routing.
Route::get('/', [PortfolioController::class, 'welcome'])->name('welcome');
Route::get('/programmer', [PortfolioController::class, 'programmer'])->name('programmer');
Route::get('/photographer', [PortfolioController::class, 'photographer'])->name('photographer');

// Stable public URL for the resume uploaded in site settings, so the link can
// go in an application without breaking the next time the PDF is replaced.
Route::get('/resume', ResumeController::class)->name('resume');

// Rate limited as the second line of spam defence behind the honeypot: a bot
// that works out the trap still cannot flood the inbox.
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

Route::get('/testimonial/{token}', [TestimonialInvitationController::class, 'show'])
    ->name('testimonial-invitations.show');
Route::post('/testimonial/{token}', [TestimonialInvitationController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('testimonial-invitations.store');

// Owner-only content management. Everything here is behind auth; there is no
// public registration, so the only account is the seeded one.
Route::middleware('auth')
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');

        // Read-only: messages arrive by email, this is the durable copy.
        Route::get('messages', [MessagesController::class, 'index'])->name('messages.index');
        Route::delete('messages/{message}', [MessagesController::class, 'destroy'])->name('messages.destroy');

        Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');

        Route::post('testimonials/invitations', [AdminTestimonialInvitationController::class, 'store'])
            ->name('testimonial-invitations.store');
        Route::post('testimonials/{testimonial}/approve', [TestimonialModerationController::class, 'approve'])
            ->name('testimonials.approve');
        Route::post('testimonials/{testimonial}/reject', [TestimonialModerationController::class, 'reject'])
            ->name('testimonials.reject');

        Route::prefix('{resource}')->name('resource.')->group(function () {
            Route::get('/', [ResourceController::class, 'index'])->name('index');
            Route::get('create', [ResourceController::class, 'create'])->name('create');
            Route::post('/', [ResourceController::class, 'store'])->name('store');
            Route::post('reorder', [ResourceController::class, 'reorder'])->name('reorder');
            Route::get('{id}/edit', [ResourceController::class, 'edit'])->name('edit');
            Route::put('{id}', [ResourceController::class, 'update'])->name('update');
            Route::delete('{id}', [ResourceController::class, 'destroy'])->name('destroy');

            // Uploaded files are managed against a record rather than through
            // its form: adding happens on save, but removing and reordering
            // act on one file and should not need the whole form submitted.
            Route::delete('{id}/media/{media}', [ResourceController::class, 'destroyMedia'])->name('media.destroy');
            Route::post('{id}/media/reorder', [ResourceController::class, 'reorderMedia'])->name('media.reorder');
        });
    });

// Breeze's auth controllers all redirect to the 'dashboard' route after login,
// verification and password confirmation. Keeping the name and pointing it at
// the admin means the owner lands where they actually work, without editing
// every one of those controllers.
Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))
    ->middleware('auth')
    ->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
