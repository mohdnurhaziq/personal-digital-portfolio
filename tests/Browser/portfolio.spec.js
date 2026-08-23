import { expect, test } from '@playwright/test';

const adminEmail = process.env.PLAYWRIGHT_ADMIN_EMAIL ?? 'e2e@example.test';
const adminPassword = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? 'playwright-only';
const allowMutations = process.env.PLAYWRIGHT_ALLOW_MUTATIONS === '1';

const visit = (page, path) => page.goto(path, { waitUntil: 'domcontentloaded' });

function collectBrowserErrors(page) {
    const errors = [];

    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error') {
            errors.push(message.text());
        }
    });

    return errors;
}

async function logIn(page) {
    await visit(page, '/login');
    await page.getByLabel('Email').fill(adminEmail);
    await page.getByLabel('Password').fill(adminPassword);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
}

const publicPages = [
    {
        path: '/',
        heading: 'Mohd. Nur Haziq Irsyamuddin',
        title: /^Portfolio - /,
    },
    {
        path: '/programmer',
        heading: 'Programmer & project manager',
        secondaryHeading: 'AI-assisted development',
        title: /^Programmer & project manager - /,
    },
    {
        path: '/photographer',
        heading: 'Photography',
        title: /^Photography - /,
    },
];

for (const publicPage of publicPages) {
    test(`${publicPage.path} renders its primary content without browser errors`, async ({ page }) => {
        const errors = collectBrowserErrors(page);
        const response = await visit(page, publicPage.path);

        expect(response?.ok()).toBe(true);
        await expect(
            page.getByRole('heading', { level: 1, name: publicPage.heading }),
        ).toBeVisible();
        if (publicPage.secondaryHeading) {
            await expect(
                page.getByRole('heading', { level: 2, name: publicPage.secondaryHeading }),
            ).toBeAttached();
        }
        await expect(page).toHaveTitle(publicPage.title);
        expect(errors).toEqual([]);
    });
}

test('admin routes redirect guests and accept the seeded owner login', async ({ page }) => {
    await visit(page, '/admin');
    await expect(page).toHaveURL(/\/login$/);

    await page.getByLabel('Email').fill(adminEmail);
    await page.getByLabel('Password').fill(adminPassword);
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
});

test('contact submission confirms and clears the form', async ({ browserName, page }) => {
    test.skip(browserName !== 'chromium', 'The successful submission mutates the isolated database once.');
    test.skip(!allowMutations, 'Set PLAYWRIGHT_ALLOW_MUTATIONS=1 only against an isolated database.');

    await visit(page, '/programmer');
    await page.getByLabel('Your name').fill('Playwright Recruiter');
    await page.getByLabel('Your email').fill('playwright@example.test');
    await page.getByLabel('Message').fill('Automated browser smoke test message.');
    await page.getByRole('button', { name: 'Send message' }).click();

    const confirmation = page.getByRole('status').filter({
        hasText: 'Thanks — your message is on its way.',
    });
    await expect(confirmation).toBeFocused();
    await expect(page.getByLabel('Your name')).toHaveValue('');
    await expect(page.getByLabel('Your email')).toHaveValue('');
    await expect(page.getByLabel('Message')).toHaveValue('');
});

test('admin project reordering persists, announces, and restores the seed order', async ({
    browserName,
    page,
}) => {
    test.skip(browserName !== 'chromium', 'The persistence round trip mutates the isolated database once.');
    test.skip(!allowMutations, 'Set PLAYWRIGHT_ALLOW_MUTATIONS=1 only against an isolated database.');

    await logIn(page);
    await visit(page, '/admin/projects');

    const rows = page.locator('tbody tr');
    await expect(rows.nth(0)).toContainText('Project one');
    await expect(rows.nth(1)).toContainText('Project two');

    await page.getByRole('button', { name: 'Move Project one down' }).click();
    await expect(
        page.getByRole('status').filter({ hasText: 'Project one moved to position 2 of 4.' }),
    ).toBeVisible();
    await expect(rows.nth(0)).toContainText('Project two');
    await expect(rows.nth(1)).toContainText('Project one');
    await expect(page.getByRole('button', { name: 'Move Project one down' })).toBeFocused();

    await page.getByRole('button', { name: 'Move Project one up' }).click();
    await expect(
        page.getByRole('status').filter({ hasText: 'Project one moved to position 1 of 4.' }),
    ).toBeVisible();
    await expect(rows.nth(0)).toContainText('Project one');
    await expect(rows.nth(1)).toContainText('Project two');
});
