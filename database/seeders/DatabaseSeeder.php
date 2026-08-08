<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->seedAdmin();

        $this->call(PortfolioContentSeeder::class);
    }

    /**
     * The site has exactly one account — the owner — used to reach /admin.
     */
    private function seedAdmin(): void
    {
        $email = config('portfolio.admin.email');
        $password = config('portfolio.admin.password');

        if (blank($password)) {
            $this->command?->warn('ADMIN_PASSWORD is not set — skipping admin user.');

            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => config('portfolio.admin.name'),
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ],
        );

        $this->command?->info("Admin user ready: {$email}");
    }
}
