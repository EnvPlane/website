import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('guided install is accessible and credential-free', async ({ page }) => {
  await page.goto('/install');
  await expect(page.getByRole('heading', { name: /Your cluster/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy Helm command' })).toBeEnabled();
  await expect(page.locator('input[type="password"], input[type="file"], form')).toHaveCount(0);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('mobile path controls remain usable without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/install');
  await page.getByRole('button', { name: 'Remote cluster' }).click();
  await page.getByRole('button', { name: 'On-prem' }).click();
  await expect(page.getByText(/Install management first/i)).toBeVisible();
  await expect(page.getByText(/No cloud account/i)).toBeVisible();
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

test('copy and selection analytics never send network requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    if (!['document', 'stylesheet', 'script', 'font'].includes(request.resourceType())) requests.push(request.url());
  });
  await page.goto('/install');
  await page.getByRole('button', { name: 'Remote cluster' }).click();
  await page.getByRole('button', { name: 'Copy Helm command' }).click();
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(requests).toEqual([]);
});
