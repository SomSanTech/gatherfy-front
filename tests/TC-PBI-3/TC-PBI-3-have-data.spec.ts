import { test, expect } from '@playwright/test';

test('TC-PBI-3.1 search 100% event name', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByPlaceholder('search..').click();
  await page.getByPlaceholder('search..').fill('Music Festival');
  await page.locator('.search-btn').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('.event-card-name').first()).toContainText(
    'Music Festival'
  );
});

test('TC-PBI-3.2 search some keyword', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByPlaceholder('search..').click();
  await page.getByPlaceholder('search..').fill('Tech');
  await page.locator('.search-btn').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('.event-card-name').first()).toContainText(
    'Tech Conference 2024'
  );
});

test('TC-PBI-3.3 search no case U u keyword', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByPlaceholder('search..').click();
  await page.getByPlaceholder('search..').fill('art exhibition');
  await page.locator('.search-btn').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('.event-card-name').first()).toContainText(
    'ART EXHIBITION 2024'
  );
});

test('TC-PBI-3.4 search some special keyword', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByPlaceholder('search..').click();
  await page.getByPlaceholder('search..').fill('Art & Design');
  await page.locator('.search-btn').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('.event-card-name').first()).toContainText(
    'THAILAND ART & DESIGN EXHIBITION'
  );
});

test('TC-PBI-3.5 search no keyword', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  // await page.getByPlaceholder('search..').click();
  // await page.getByPlaceholder('search..').fill('Art & Design');
  await page.locator('.search-btn').click();
  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(7);
  // await expect(page.locator('.event-card-name').first()).toContainText('THAILAND ART & DESIGN EXHIBITION')
});

test('TC-PBI-3.6 search no keyword at home', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);
  await page.locator('.search-btn').click();
  // await page.locator('button:has-text("See all events")').click({ force: true });
  await page.waitForTimeout(3000);

  // await page.getByPlaceholder('search..').click();
  // await page.getByPlaceholder('search..').fill('Art & Design');

  // await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(7);
  // await expect(page.locator('.event-card-name').first()).toContainText('THAILAND ART & DESIGN EXHIBITION')
});

test('TC-PBI-3.7 search no keyword in db', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByPlaceholder('search..').click();
  await page.getByPlaceholder('search..').fill('World');
  await page.locator('.search-btn').click();
  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(0);
  await expect(page.locator('.no-event-search').first()).toContainText(
    `Can't Find Events You're Looking For`
  );
});
