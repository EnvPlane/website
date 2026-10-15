import { expect, test } from '@playwright/test';

test('root, pricing and install remain informational routes', async ({ page }) => {
  const mutations: string[] = [];
  page.on('request', request => {
    if (!['GET', 'HEAD'].includes(request.method())) {
      mutations.push(`${request.method()} ${new URL(request.url()).pathname}`);
    }
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Ship environments without building another platform.' })).toBeVisible();
  await page.getByRole('link', { name: 'Compare subscription plans' }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Subscription plans' })).toBeVisible();
  await expect(page.getByText('Team and Business prices include VAT. Your invoice shows the applicable tax breakdown.')).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Team — €99\/month$/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Business — €299\/month$/ })).toBeVisible();
  await expect(page.locator('form, input[type="password"], input[type="email"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Install and configure' }).click();
  await expect(page).toHaveURL(/\/install$/);
  await expect(page.getByRole('heading', { level: 1, name: /Your cluster/i })).toBeVisible();
  expect(mutations).toEqual([]);
});
