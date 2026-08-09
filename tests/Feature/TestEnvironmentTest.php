<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Guards where the suite is pointed, which has gone wrong twice.
 *
 * Once it ran against the development database and RefreshDatabase truncated
 * the real content; once the pin was ignored entirely because PHPUnit's `<env>`
 * does not override an existing variable and does not touch `$_SERVER`, which
 * is what Laravel's env() reads first.
 *
 * Neither failure announced itself — the suite passed either way. These
 * assertions are the announcement.
 */
class TestEnvironmentTest extends TestCase
{
    public function test_the_suite_runs_on_mysql_not_a_sqlite_fallback(): void
    {
        // SQLite would be faster, but it differs from production on column
        // types, JSON handling and constraint behaviour — exactly the bugs a
        // test suite exists to catch before a deploy does.
        $this->assertSame('mysql', config('database.default'));
        $this->assertSame('mysql', DB::connection()->getDriverName());
    }

    public function test_the_suite_never_points_at_the_development_database(): void
    {
        $database = DB::connection()->getDatabaseName();

        $this->assertSame('portfolio_test', $database);
        $this->assertNotSame('portfolio', $database, 'The suite is about to truncate the development data.');
    }
}
