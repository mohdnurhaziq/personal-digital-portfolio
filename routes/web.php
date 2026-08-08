<?php

use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public portfolio. Each path gets a real URL so links are shareable — the
// cinematic transitions are layered on top of Inertia visits, not a substitute
// for routing.
Route::get('/', [PortfolioController::class, 'welcome'])->name('welcome');
Route::get('/programmer', [PortfolioController::class, 'programmer'])->name('programmer');
Route::get('/photographer', [PortfolioController::class, 'photographer'])->name('photographer');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
