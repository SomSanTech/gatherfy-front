import { test, expect } from '@playwright/test';

test('TC-PBI-11.1 admin see 200 year dashboard', async ({ page }) => {
  await page.goto('/us1/backoffice');

  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.waitForTimeout(3000);

  await page
    .getByRole('row', { name: '200 Years Journey Through' })
    .getByRole('link')
    .click();
  await page.waitForTimeout(3000);

  const currentUrl = await page.url();
  console.log('currentUrl', currentUrl);
  await expect(currentUrl).toContain('/backoffice/dashboard/3');

  await expect(page.locator('.dash-event-name')).toContainText(
    '200 Years Journey Through Thai Modern Art History'
  );
  await expect(page.locator('.dash-event-date')).toBeVisible();
  await expect(page.locator('.dash-event-time')).toBeVisible();
  await expect(page.locator('.dash-event-location')).toBeVisible();
  await expect(page.locator('.view-by-7day')).toBeVisible();
  await expect(page.locator('.view-goal')).toBeVisible();
  await expect(page.locator('.overall')).toBeVisible();
  await expect(page.locator('.view-by-gender-age')).toBeVisible();
  await expect(page.locator('.view-by-gender')).toBeVisible();
  await expect(page.locator('.view-by-checkin')).toBeVisible();
  await expect(page.locator('.view-by-feedback')).toBeVisible();
});

test('TC-PBI-11.2 admin see no dashboard', async ({ page }) => {
  await page.goto('/us1/backoffice/dashboard/99');

  await page.waitForTimeout(3000);

  await expect(page.locator('.error-text')).toContainText(
    'The page you are looking for cannot be found'
  );
});
