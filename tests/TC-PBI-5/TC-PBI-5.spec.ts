import { test, expect } from '@playwright/test';

test('TC-PBI-5.1 filter event with date', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);
  const dateButton = page.locator('div[aria-label="Monday, Dec 2, 2024"]');
  await dateButton.click();
  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(3);
});

test('TC-PBI-5.2 cancle filter event with date', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);
  const dateButton = page.locator('div[aria-label="Monday, Dec 2, 2024"]');
  await dateButton.click();
  await page.waitForTimeout(3000);
  await dateButton.click();
  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(7);
});

test('TC-PBI-5.3 filter with no  event date', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);
  await page.getByLabel('Tuesday, Dec 31,').click();

  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(0);

  await expect(page.locator('.no-event-search').first()).toContainText(
    `Can't Find Events You're Looking For`
  );
});
