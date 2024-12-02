import { test, expect } from '@playwright/test';

test('TC-PBI-10.1 admin see overall dashboard', async ({ page }) => {
  await page.goto('/backoffice');

  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.waitForTimeout(3000);

  await expect(page.locator('.overall')).toBeVisible();
  await expect(page.locator('.view-by-month')).toBeVisible();
  await expect(page.locator('.view-by-gender')).toBeVisible();
  await expect(page.locator('.event-list-div')).toBeVisible();

  const eventList = await page.locator('.event-list');

  const count = await eventList.count();

  await expect(count).toBe(4);
});

test('TC-PBI-10.2 admin see no overall dashboard', async ({ page }) => {
  await page.goto('/backoffice');

  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.waitForTimeout(3000);

  await expect(page.locator('.error-msg')).toContainText(
    'No events to display. Create your first event to get started!'
  );
  await expect(page.locator('.view-by-month')).toBeHidden();
  await expect(page.locator('.view-by-gender')).toBeHidden();
  await expect(page.locator('.event-list-div')).toBeHidden();
});
