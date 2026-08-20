<?php

namespace App\Providers;

use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Environment variables the Docker stack sets on the container, which
     * `artisan serve` would otherwise drop.
     */
    private const CONTAINER_VARIABLES = [
        'APP_URL',
        'DB_CONNECTION',
        'DB_HOST',
        'DB_PORT',
        'DB_DATABASE',
        'DB_USERNAME',
        'DB_PASSWORD',
        'VITE_DEV_SERVER_URL',
        'INERTIA_SSR_ENABLED',
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        $this->keepContainerEnvironmentWhenServing();
    }

    /**
     * `artisan serve` spawns the PHP development server with a *filtered*
     * environment: anything not on `ServeCommand::$passthroughVariables` is
     * stripped from the child process.
     *
     * In Docker that is silently destructive. Compose sets DB_* and APP_URL as
     * real environment variables, so `artisan migrate` — a direct call — runs
     * against MySQL, while every HTTP request is served by the child, which
     * never sees them and falls back to the bind-mounted `.env`. The stack
     * looks healthy and serves the wrong database.
     */
    private function keepContainerEnvironmentWhenServing(): void
    {
        // `serve` is a console command, so there is nothing to fix up on a
        // production request — where this would otherwise run every time.
        if (! $this->app->runningInConsole() || ! class_exists(ServeCommand::class)) {
            return;
        }

        ServeCommand::$passthroughVariables = array_values(array_unique(array_merge(
            ServeCommand::$passthroughVariables,
            self::CONTAINER_VARIABLES,
        )));
    }
}
