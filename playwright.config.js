import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/Browser',
    fullyParallel: false,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    // The Docker dev stack uses Laravel's single-process server. Serial browser
    // projects keep WebKit/Firefox asset loads and bcrypt login from starving
    // one another, and keep the database round-trip checks deterministic.
    workers: 1,
    timeout: 60_000,
    expect: {
        timeout: 15_000,
    },
    reporter: process.env.CI
        ? [['line'], ['html', { open: 'never' }]]
        : [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8000',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        video: 'off',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
