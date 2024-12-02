import { test, expect } from '@playwright/test';

test('TC-PBI-6.1 sort event with date', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Sort By' }).click();
  await page.getByRole('button', { name: 'Newest first' }).click();
  await page.waitForTimeout(2000);
  await page.locator('.sort-div').isHidden();
  await page.waitForTimeout(3000);

  const eventListCard = page.locator('.event-card');
  let previousDate = Infinity;

  const cardCount = await eventListCard.count();

  for (let i = 0; i < cardCount; ++i) {
    const card = eventListCard.nth(i);
    const cardTextDate = await card.locator('.event-card-date').innerText();
    const cardStartDate = new Date(cardTextDate).getTime();

    if (cardStartDate > previousDate) {
      throw new Error(
        `Event cards are not sorted properly. Event at index ${i} is out of order.`
      );
    }
    previousDate = cardStartDate;
  }
});

test('TC-PBI-6.2 sort event with date old to new', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Sort By' }).click();
  await page.getByRole('button', { name: 'Oldest first' }).click();
  await page.waitForTimeout(2000);
  await page.locator('.sort-div').isHidden();
  await page.waitForTimeout(3000);

  const eventListCard = page.locator('.event-card');
  let previousDate = 0;

  const cardCount = await eventListCard.count();

  for (let i = 0; i < cardCount; ++i) {
    const card = eventListCard.nth(i);
    const cardTextDate = await card.locator('.event-card-date').innerText();
    const cardStartDate = new Date(cardTextDate).getTime();

    if (cardStartDate < previousDate) {
      throw new Error(
        `Event cards are not sorted properly. Event at index ${i} is out of order.`
      );
    }
    previousDate = cardStartDate;
  }
});

test('TC-PBI-6.3 sort event with A-Z', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Sort By' }).click();
  await page.getByRole('button', { name: 'A-Z' }).click();
  await page.waitForTimeout(2000);
  await page.locator('.sort-div').isHidden();
  await page.waitForTimeout(3000);

  const eventListCard = page.locator('.event-card');
  let previousName = '';

  const cardCount = await eventListCard.count();

  for (let i = 0; i < cardCount; ++i) {
    const card = eventListCard.nth(i);
    const cardName = await card.locator('.event-card-name').innerText();

    if (cardName.localeCompare(previousName) < 0) {
      throw new Error(
        `Event cards are not sorted properly by name. Event at index ${i} is out of order.`
      );
    }
    previousName = cardName;
  }
});

test('TC-PBI-6.4 sort event with Z-A', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Sort By' }).click();
  await page.getByRole('button', { name: 'Z-A' }).click();
  await page.waitForTimeout(2000);
  await page.locator('.sort-div').isHidden();
  await page.waitForTimeout(3000);

  const eventListCard = page.locator('.event-card');
  let previousName = 'ZZZZZZZZ';

  const cardCount = await eventListCard.count();

  for (let i = 0; i < cardCount; ++i) {
    const card = eventListCard.nth(i);
    const cardName = await card.locator('.event-card-name').innerText();

    if (cardName.localeCompare(previousName) > 0) {
      throw new Error(
        `Event cards are not sorted properly by name (Z-A). Event at index ${i} is out of order.`
      );
    }
    previousName = cardName;
  }
});

test('TC-PBI-6.4 sort event with date and A-Z', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page
    .locator('button:has-text("See all events")')
    .click({ force: true });
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Sort By' }).click();
  await page.getByRole('button', { name: 'Newest first' }).click();
  await page.getByRole('button', { name: 'Sort By' }).click();
  await page.getByRole('button', { name: 'A-Z' }).click();
  await page.waitForTimeout(3000);

  await page.locator('.sort-div').isHidden();
  await page.waitForTimeout(3000);

  const eventListCard = page.locator('.event-card');
  let previousName = '';

  const cardCount = await eventListCard.count();

  for (let i = 0; i < cardCount; ++i) {
    const card = eventListCard.nth(i);
    const cardName = await card.locator('.event-card-name').innerText();

    if (cardName.localeCompare(previousName) < 0) {
      throw new Error(
        `Event cards are not sorted properly by name. Event at index ${i} is out of order.`
      );
    }
    previousName = cardName;
  }
});
