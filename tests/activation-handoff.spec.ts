import { expect, test } from '@playwright/test';

const activationCode = 'epac.v1.browser-coverage.redacted-signature';

test.use({ trace: 'off', screenshot: 'off', video: 'off' });

test('activation checkout and redemption handoff stays browser-private', async ({ page }) => {
  const checkoutBodies: unknown[] = [];
  const redemptionBodies: unknown[] = [];

  await page.route('**/v1/checkout-sessions', async route => {
    checkoutBodies.push(route.request().postDataJSON());
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ sessionId: 'checkout-session-browser-test', checkoutUrl: 'https://checkout.example.test/session' }),
    });
  });
  await page.route('**/v1/licenses/license-browser-test/redeem', async route => {
    redemptionBodies.push(route.request().postDataJSON());
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ activationCode }) });
  });

  await page.goto('/install');
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  await page.getByRole('button', { name: 'Request checkout' }).click();
  await expect(page.getByRole('link', { name: 'Continue to secure checkout' })).toHaveAttribute('href', 'https://checkout.example.test/session');
  expect(checkoutBodies).toEqual([{ sku: 'team' }]);

  await page.getByLabel('Issued license ID').fill('license-browser-test');
  await page.getByLabel('Installation ID').fill('installation-browser-test');
  await page.getByLabel('Tenant ID').fill('tenant-browser-test');
  await page.getByLabel('One-time nonce').fill('nonce-browser-test');
  await page.getByRole('button', { name: 'Create activation code' }).click();
  await expect(page.getByLabel('Activation code')).toHaveText(activationCode);
  expect(redemptionBodies).toEqual([{
    installationId: 'installation-browser-test',
    nonce: 'nonce-browser-test',
    tenantId: 'tenant-browser-test',
  }]);

  await page.getByRole('button', { name: 'I installed it — clear code' }).click();
  await expect(page.getByLabel('Activation code')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(activationCode);
  const browserStorage = await page.evaluate(() => JSON.stringify({ localStorage: { ...localStorage }, sessionStorage: { ...sessionStorage } }));
  expect(browserStorage).not.toContain(activationCode);
});
