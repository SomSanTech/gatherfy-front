import { test, expect } from '@playwright/test';

test('TC-PBI-1.1 user view section banner', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);

  const prevButton = await page.locator('.header-btn-prev');
  const nextButton = await page.locator('.header-btn-next');

  await prevButton.click();
  await expect(page.locator('.event-name')).toHaveText(
    '200 Years Journey Through Thai Modern Art History'
  );
  await page.waitForSelector('.btn');
  const joinButton1 = await page.locator('button', { hasText: 'Join now' });
  await expect(joinButton1).toHaveText('Join now');

  await nextButton.click();
  await expect(page.locator('.event-name')).toHaveText('HOMECOMING');
  await page.waitForSelector('.btn');
  const joinButton2 = await page.locator('button', { hasText: 'Join now' });
  await expect(joinButton2).toHaveText('Join now');

  await nextButton.click();
  await expect(page.locator('.event-name')).toHaveText('ART EXHIBITION 2024');
  await page.waitForSelector('.btn');
  const joinButton3 = await page.locator('button', { hasText: 'Join now' });
  await expect(joinButton3).toHaveText('Join now');

  await nextButton.click();
  await expect(page.locator('.event-name')).toHaveText('Startup Pitch Night');
  await page.waitForSelector('.btn');
  const joinButton4 = await page.locator('button', { hasText: 'Join now' });
  await expect(joinButton4).toHaveText('Join now');
});

test('TC-PBI-1.2 user view section recommended ', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);

  const prevButton = await page.locator('.recommended-btn-prev');
  const nextButton = await page.locator('.recommended-btn-next');

  await prevButton.click();
  await expect(page.locator('.reccom-name')).toBeVisible();
  await expect(page.locator('.reccom-detail')).toBeVisible();
  await page.waitForSelector('.btn');
  const regisNowBtn1 = await page.locator('button', {
    hasText: 'Registor now',
  });
  await expect(regisNowBtn1).toHaveText('Registor now');

  await expect(page.locator('.reccom-when')).toBeVisible();
  await expect(page.locator('.reccom-where')).toBeVisible();
  await expect(page.locator('.reccom-who')).toBeVisible();

  await nextButton.click();
  await expect(page.locator('.reccom-name')).toBeVisible();
  await expect(page.locator('.reccom-detail')).toBeVisible();
  await page.waitForSelector('.btn');
  const regisNowBtn2 = await page.locator('button', {
    hasText: 'Registor now',
  });
  await expect(regisNowBtn2).toHaveText('Registor now');

  await expect(page.locator('.reccom-when')).toBeVisible();
  await expect(page.locator('.reccom-where')).toBeVisible();
  await expect(page.locator('.reccom-who')).toBeVisible();
});

test('TC-PBI-1.3 user view section today events', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);
  const section = page.locator('div#time-list');
  await section.scrollIntoViewIfNeeded();
  await page.waitForSelector('.btn');

  const todayEventBtn = await page.locator('button', {
    hasText: 'Today event',
  });

  await expect(page.locator('.time-title')).toContainText(/Today/i);

  await todayEventBtn.click();
  await page.waitForTimeout(3000);
  const eventListCard = page.locator('.event-card');

  const sectionCard = page.locator('div#time-list-card');
  await sectionCard.scrollIntoViewIfNeeded();
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(3);

  for (let i = 0; i < cardCount; ++i) {
    const card = eventListCard.nth(i);
    const cardName = card.locator('.event-card-name');
    const cardLocation = card.locator('.event-card-location');
    const cardTextDate = await card.locator('.event-card-date').innerText();
    const cardImage = await card.locator('.event-card-img');
    const today = new Date().getTime();
    const cardStartDate = new Date(cardTextDate).getTime();

    expect(cardStartDate).toBeLessThanOrEqual(today);
    expect(cardImage).toBeVisible();

    if (i === 0) {
      await expect(cardName).toHaveText(
        '200 Years Journey Through Thai Modern Art History'
      );
      await expect(cardLocation).toContainText(
        'Museum Pier, 166 Tha Suphan Alley, Phra Borom Maha Ratchawang, Phra Nakhon, Bangkok 10200'
      );
    } else if (i === 1) {
      await expect(cardName).toContainText('Music Festival');
      await expect(cardLocation).toContainText('Beachside, Phuket');
    } else if (i === 2) {
      await expect(cardName).toContainText('Tech Conference 2024');
      await expect(cardLocation).toContainText('Convention Center, Bangkok');
    }
  }
});

test('TC-PBI-1.4 user view section upcoming events', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);
  const section = page.locator('div#time-list');
  await section.scrollIntoViewIfNeeded();
  await page.waitForSelector('.btn');

  const upcomeEventBtn = await page.locator('button', {
    hasText: 'Upcoming event',
  });

  await upcomeEventBtn.click();
  await page.waitForTimeout(3000);
  await expect(page.locator('.time-title')).toContainText(/Upcomming/i);

  const eventListCard = page.locator('.event-card');

  const sectionCard = page.locator('div#time-list-card');
  await sectionCard.scrollIntoViewIfNeeded();
  const cardCount = await eventListCard.count();
  expect(cardCount).toBe(4);

  for (let i = 0; i < cardCount; ++i) {
    const card = eventListCard.nth(i);
    const cardName = card.locator('.event-card-name');
    const cardLocation = card.locator('.event-card-location');
    const cardTextDate = await card.locator('.event-card-date').innerText();
    const cardImage = await card.locator('.event-card-img');
    const today = new Date().getTime();
    const cardStartDate = new Date(cardTextDate).getTime();

    expect(cardStartDate).toBeGreaterThan(today);
    expect(cardImage).toBeVisible();

    if (i === 1) {
      await expect(cardName).toHaveText('ART EXHIBITION 2024');
      await expect(cardLocation).toContainText('Art Gallery, Bangkok');
    } else if (i === 0) {
      await expect(cardName).toContainText('HOMECOMING');
      await expect(cardLocation).toContainText(
        'Seacon Square Srinakarin, Prawet, Bangkok 10250'
      );
    } else if (i === 2) {
      await expect(cardName).toContainText('Startup Pitch Night');
      await expect(cardLocation).toContainText('Co-Working Space, Chiang Mai');
    } else if (i === 3) {
      await expect(cardName).toContainText('THAILAND ART & DESIGN EXHIBITION');
      await expect(cardLocation).toContainText('One Bangkok');
    }
  }
});

test('TC-PBI-1.5 user view section explore by date', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(5000);
  const section = page.locator('div#explore-date');
  await section.scrollIntoViewIfNeeded();

  await expect(page.locator('.explore-title')).toContainText(
    /Explore by date/i
  );

  const exploreListCard = page.locator('.explore-card');

  const cardCount = await exploreListCard.count();
  await page.waitForTimeout(3000);

  expect(cardCount).toBe(7);

  for (let i = 0; i < cardCount; ++i) {
    const card = exploreListCard.nth(i);
    const cardName = card.locator('.explore-card-name');
    const cardLocation = card.locator('.explore-card-location');
    const cardTime = card.locator('.explore-card-time');
    const cardOwner = card.locator('.explore-card-owner');
    const cardImage = card.locator('.explore-card-img');

    expect(cardLocation).toBeVisible();
    expect(cardTime).toBeVisible();
    expect(cardOwner).toBeVisible();
    expect(cardImage).toBeVisible();

    if (i === 0) {
      await expect(cardName).toHaveText('Tech Conference 2024');
    } else if (i === 1) {
      await expect(cardName).toContainText('Music Festival');
    } else if (i === 2) {
      await expect(cardName).toContainText(
        '200 Years Journey Through Thai Modern Art History'
      );
    } else if (i === 3) {
      await expect(cardName).toContainText('Startup Pitch Night');
    } else if (i === 4) {
      await expect(cardName).toContainText('THAILAND ART & DESIGN EXHIBITION');
    } else if (i === 5) {
      await expect(cardName).toContainText('ART EXHIBITION 2024');
    } else if (i === 6) {
      await expect(cardName).toContainText('HOMECOMING');
    }
  }
});

test('TC-PBI-1.6  explore by date 20 Dec 2024', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);
  const section = page.locator('div#explore-date');
  await section.scrollIntoViewIfNeeded();

  await expect(page.locator('.explore-title')).toContainText(
    /Explore by date/i
  );

  const dateButton = page.locator('div[aria-label="Friday, Dec 20, 2024"]');
  await dateButton.click();

  const exploreListCard = page.locator('.explore-card');
  const cardCount = await exploreListCard.count();
  expect(cardCount).toBe(4);

  for (let i = 0; i < cardCount; ++i) {
    const card = exploreListCard.nth(i);
    const cardName = card.locator('.explore-card-name');
    const cardLocation = card.locator('.explore-card-location');
    const cardTime = card.locator('.explore-card-time');
    const cardOwner = card.locator('.explore-card-owner');
    const cardImage = card.locator('.explore-card-img');

    expect(cardLocation).toBeVisible();
    expect(cardTime).toBeVisible();
    expect(cardOwner).toBeVisible();
    expect(cardImage).toBeVisible();

    if (i === 0) {
      await expect(cardName).toContainText(
        '200 Years Journey Through Thai Modern Art History'
      );
    } else if (i === 1) {
      await expect(cardName).toContainText('THAILAND ART & DESIGN EXHIBITION');
    } else if (i === 2) {
      await expect(cardName).toContainText('ART EXHIBITION 2024');
    } else if (i === 3) {
      await expect(cardName).toContainText('HOMECOMING');
    }
  }
});
