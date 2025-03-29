import { test, expect } from '@playwright/test';

test('TC-PBI-1.7 no event in today', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);
  const section = page.locator('div#time-list');
  await section.scrollIntoViewIfNeeded();
  await expect(page.locator('.time-title')).toContainText(/Today/i);
  const noCardText = page.locator('.no-card-message');
  expect(noCardText).toContainText('No events today');
});

test('TC-PBI-1.8 no event in upcomming', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);
  const section = page.locator('div#time-list');
  await section.scrollIntoViewIfNeeded();

  await page.waitForSelector('.btn');

  const upcomeEventBtn = await page.locator('button', {
    hasText: 'Upcoming event',
  });

  upcomeEventBtn.click();
  await page.waitForTimeout(2000);

  await expect(page.locator('.time-title')).toContainText(/Upcomming/i);

  const noCardText = page.locator('.no-card-message');
  expect(noCardText).toContainText('No upcoming events');
});

test('TC-PBI-1.9 no event in explore', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);
  const section = page.locator('div#explore-date');
  await section.scrollIntoViewIfNeeded();

  await page.getByLabel('Tuesday, Dec 31,').click();
  await page.waitForTimeout(2000);

  const noCardText = page.locator('.no-explore-message');
  expect(noCardText).toContainText('There are no events during this period');
});
