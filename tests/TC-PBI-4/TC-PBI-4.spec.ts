import { test, expect } from '@playwright/test';

test('TC-PBI-4.1 select tag music', async ({ page }) => {
  // await page.goto('/us1');
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Music' }).first().click();
  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(2);
});

test('TC-PBI-4.2 select tag music and art', async ({ page }) => {
  // await page.goto('/us1');
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Music' }).first().click();
  await page.getByRole('button', { name: 'Art' }).first().click();
  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(5);
});

test('TC-PBI-4.3 unselect tag', async ({ page }) => {
  // await page.goto('/us1');
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Music' }).first().click();
  await page.getByRole('button', { name: 'Art' }).first().click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Music' }).first().click();
  await page.getByRole('button', { name: 'Art' }).first().click();
  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(7);
});

test('TC-PBI-4.4 no event in tag', async ({ page }) => {
  // await page.goto('/us1');
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sports' }).first().click();
  await page.waitForTimeout(5000);

  const eventListCard = page.locator('.event-card');
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(0);

  await expect(page.locator('.no-event-search').first()).toContainText(
    `Can't Find Events You're Looking For`
  );
});
