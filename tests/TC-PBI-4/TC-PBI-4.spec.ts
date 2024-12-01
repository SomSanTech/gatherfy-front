import { test, expect } from '@playwright/test';

test('TC-PBI-4.1 select tag music', async ({ page }) => {
  await page.goto('http://localhost:3000/');

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
  await page.goto('http://localhost:3000/');

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
  await page.goto('http://localhost:3000/');

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
  await page.goto('http://localhost:3000/');

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

// test('TC-PBI-3.5 search no keyword', async ({ page }) => {
//   await page.goto('http://localhost:3000/');

//   await page.waitForTimeout(3000);

//   await page
//     .locator('button:has-text("See all events")')
//     .click({ force: true });
//   await page.waitForTimeout(3000);

//   // await page.getByPlaceholder('search..').click();
//   // await page.getByPlaceholder('search..').fill('Art & Design');
//   await page.locator('.search-btn').click();
//   await page.waitForTimeout(3000);
//   const eventListCard = page.locator('.event-card');
//   const cardCount = await eventListCard.count();
//   expect(cardCount).toBe(7);
//   // await expect(page.locator('.event-card-name').first()).toContainText('THAILAND ART & DESIGN EXHIBITION')
// });

// test('TC-PBI-3.6 search no keyword at home', async ({ page }) => {
//   await page.goto('http://localhost:3000/');

//   await page.waitForTimeout(3000);
//   await page.locator('.search-btn').click();
//   // await page.locator('button:has-text("See all events")').click({ force: true });
//   await page.waitForTimeout(3000);

//   // await page.getByPlaceholder('search..').click();
//   // await page.getByPlaceholder('search..').fill('Art & Design');

//   // await page.waitForTimeout(3000);
//   const eventListCard = page.locator('.event-card');
//   const cardCount = await eventListCard.count();
//   expect(cardCount).toBe(7);
//   // await expect(page.locator('.event-card-name').first()).toContainText('THAILAND ART & DESIGN EXHIBITION')
// });

// test('TC-PBI-3.7 search no keyword in db', async ({ page }) => {
//   await page.goto('http://localhost:3000/');

//   await page.waitForTimeout(3000);

//   await page
//     .locator('button:has-text("See all events")')
//     .click({ force: true });
//   await page.waitForTimeout(3000);

//   await page.getByPlaceholder('search..').click();
//   await page.getByPlaceholder('search..').fill('World');
//   await page.locator('.search-btn').click();
//   await page.waitForTimeout(3000);
//   const eventListCard = page.locator('.event-card');
//   const cardCount = await eventListCard.count();
//   expect(cardCount).toBe(0);
//   await expect(page.locator('.no-event-search').first()).toContainText(
//     `Can't Find Events You're Looking For`
//   );
// });
// test('TC-PBI-1.2 view event in recoomended event', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.waitForTimeout(3000);

//   const prevButton = await page.locator('.recommended-btn-prev');
//   const nextButton = await page.locator('.recommended-btn-next');

//   await prevButton.click();
//   await expect(page.locator('.reccom-name')).toBeVisible();
//   await expect(page.locator('.reccom-detail')).toBeVisible();
//   await page.waitForSelector('.btn');
//   const regisNowBtn = await page.locator('button', { hasText: 'Registor now' });
//   await expect(regisNowBtn).toHaveText('Registor now');

//   await expect(page.locator('.reccom-when')).toBeVisible();
//   await expect(page.locator('.reccom-where')).toBeVisible();
//   await expect(page.locator('.reccom-who')).toBeVisible();
// });

// test('TC-PBI-1.3 view event in today event', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.waitForTimeout(3000);
//   const section = page.locator('div#time-list');
//   await section.scrollIntoViewIfNeeded();
//   await page.waitForSelector('.btn');

//   const todayEventBtn = await page.locator('button', {
//     hasText: 'Today event',
//   });
//   const upcomeEventBtn = await page.locator('button', {
//     hasText: 'Upcoming event',
//   });

//   await expect(page.locator('.time-title')).toContainText(/Today/i);

//   await todayEventBtn.click();
//   await page.waitForTimeout(3000);
//   const eventListCard = page.locator('.event-card');
//   const noCardText = page.locator('.no-card-message');

//   const sectionCard = page.locator('div#time-list-card');
//   await sectionCard.scrollIntoViewIfNeeded();
//   const cardCount = await eventListCard.count();
//   expect(cardCount).toBe(3);

//   for (let i = 0; i < cardCount; ++i) {
//     const card = eventListCard.nth(i);
//     const cardName = card.locator('.event-card-name');
//     const cardLocation = card.locator('.event-card-location');
//     const cardTextDate = await card.locator('.event-card-date').innerText();
//     const cardImage = await card.locator('.event-card-img');
//     const today = new Date().getTime();
//     const cardStartDate = new Date(cardTextDate).getTime();

//     expect(cardStartDate).toBeLessThanOrEqual(today);
//     expect(cardImage).toBeVisible();

//     if (i === 0) {
//       await expect(cardName).toHaveText(
//         '200 Years Journey Through Thai Modern Art History'
//       );
//       await expect(cardLocation).toContainText(
//         'Museum Pier, 166 Tha Suphan Alley, Phra Borom Maha Ratchawang, Phra Nakhon, Bangkok 10200'
//       );
//     } else if (i === 1) {
//       await expect(cardName).toContainText('Music Festival');
//       await expect(cardLocation).toContainText('Beachside, Phuket');
//     } else if (i === 2) {
//       await expect(cardName).toContainText('Tech Conference 2024');
//       await expect(cardLocation).toContainText('Convention Center, Bangkok');
//     }
//   }
// });

// test('TC-PBI-1.4 view event in upcome event', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.waitForTimeout(3000);
//   const section = page.locator('div#time-list');
//   await section.scrollIntoViewIfNeeded();
//   await page.waitForSelector('.btn');

//   const upcomeEventBtn = await page.locator('button', {
//     hasText: 'Upcoming event',
//   });

//   await upcomeEventBtn.click();
//   await page.waitForTimeout(3000);
//   await expect(page.locator('.time-title')).toContainText(/Upcomming/i);

//   const eventListCard = page.locator('.event-card');
//   const noCardText = page.locator('.no-card-message');

//   const sectionCard = page.locator('div#time-list-card');
//   await sectionCard.scrollIntoViewIfNeeded();
//   const cardCount = await eventListCard.count();
//   expect(cardCount).toBe(4);

//   for (let i = 0; i < cardCount; ++i) {
//     const card = eventListCard.nth(i);
//     const cardName = card.locator('.event-card-name');
//     const cardLocation = card.locator('.event-card-location');
//     const cardTextDate = await card.locator('.event-card-date').innerText();
//     const cardImage = await card.locator('.event-card-img');
//     const today = new Date().getTime();
//     const cardStartDate = new Date(cardTextDate).getTime();

//     expect(cardStartDate).toBeGreaterThan(today);
//     expect(cardImage).toBeVisible();

//     if (i === 0) {
//       await expect(cardName).toHaveText('ART EXHIBITION 2024');
//       await expect(cardLocation).toContainText('Art Gallery, Bangkok');
//     } else if (i === 1) {
//       await expect(cardName).toContainText('HOMECOMING');
//       await expect(cardLocation).toContainText(
//         'Seacon Square Srinakarin, Prawet, Bangkok 10250'
//       );
//     } else if (i === 2) {
//       await expect(cardName).toContainText('Startup Pitch Night');
//       await expect(cardLocation).toContainText('Co-Working Space, Chiang Mai');
//     } else if (i === 3) {
//       await expect(cardName).toContainText('THAILAND ART & DESIGN EXHIBITION');
//       await expect(cardLocation).toContainText('One Bangkok');
//     }
//   }
// });

// test('TC-PBI-1.5 view event in explore date event', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.waitForTimeout(5000);
//   const section = page.locator('div#explore-date');
//   await section.scrollIntoViewIfNeeded();

//   await expect(page.locator('.explore-title')).toContainText(
//     /Explore by date/i
//   );

//   const exploreListCard = page.locator('.explore-card');
//   const noExploreText = page.locator('.no-explore-message');

//   // const sectionCard = page.locator('div#time-list-card');
//   // await sectionCard.scrollIntoViewIfNeeded();
//   const cardCount = await exploreListCard.count();
//   await page.waitForTimeout(3000);

//   expect(cardCount).toBe(7);

//   for (let i = 0; i < cardCount; ++i) {
//     const card = exploreListCard.nth(i);
//     const cardName = card.locator('.explore-card-name');
//     const cardLocation = card.locator('.explore-card-location');
//     const cardTime = card.locator('.explore-card-time');
//     const cardOwner = card.locator('.explore-card-owner');
//     const cardDate = card.locator('.explore-card-date');
//     const cardImage = card.locator('.explore-card-img');
//     // const cardTextDate = await card.locator('.explore-card-date').innerText();
//     // const today = new Date().getTime();
//     // const cardStartDate = new Date(cardTextDate).getTime();

//     // expect(cardStartDate).toBeGreaterThan(today);
//     // expect(cardName).toBeVisible();
//     expect(cardLocation).toBeVisible();
//     expect(cardTime).toBeVisible();
//     expect(cardOwner).toBeVisible();
//     // expect(cardDate).toBeVisible();
//     expect(cardImage).toBeVisible();

//     if (i === 0) {
//       await expect(cardName).toHaveText('Tech Conference 2024');
//     } else if (i === 1) {
//       await expect(cardName).toContainText('Music Festival');
//     } else if (i === 2) {
//       await expect(cardName).toContainText(
//         '200 Years Journey Through Thai Modern Art History'
//       );
//     } else if (i === 3) {
//       await expect(cardName).toContainText('Startup Pitch Night');
//     } else if (i === 4) {
//       await expect(cardName).toContainText('THAILAND ART & DESIGN EXHIBITION');
//     } else if (i === 5) {
//       await expect(cardName).toContainText('ART EXHIBITION 2024');
//     } else if (i === 6) {
//       await expect(cardName).toContainText('HOMECOMING');
//     }
//   }
// });

// test('TC-PBI-1.6 view event in explore date 20', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.waitForTimeout(3000);
//   const section = page.locator('div#explore-date');
//   await section.scrollIntoViewIfNeeded();

//   await expect(page.locator('.explore-title')).toContainText(
//     /Explore by date/i
//   );

//   const noExploreText = page.locator('.no-explore-message');

//   // const sectionCard = page.locator('div#time-list-card');
//   // await sectionCard.scrollIntoViewIfNeeded();

//   // const datePicker = page.locator('div[class*="DatePicker"]');
//   // await datePicker.click(); // เปิด DatePicker

//   const dateButton = page.locator('div[aria-label="Friday, Dec 20, 2024"]');
//   await dateButton.click();

//   const exploreListCard = page.locator('.explore-card');
//   const cardCount = await exploreListCard.count();
//   expect(cardCount).toBe(4);

//   for (let i = 0; i < cardCount; ++i) {
//     const card = exploreListCard.nth(i);
//     const cardName = card.locator('.explore-card-name');
//     const cardLocation = card.locator('.explore-card-location');
//     const cardTime = card.locator('.explore-card-time');
//     const cardOwner = card.locator('.explore-card-owner');
//     const cardDate = card.locator('.explore-card-date');
//     const cardImage = card.locator('.explore-card-img');

//     // const cardTextDate = await card.locator('.explore-card-date').innerText();
//     // const today = new Date().getTime();
//     // const cardStartDate = new Date(cardTextDate).getTime();

//     // expect(cardStartDate).toBeGreaterThan(today);
//     // expect(cardName).toBeVisible();
//     expect(cardLocation).toBeVisible();
//     expect(cardTime).toBeVisible();
//     expect(cardOwner).toBeVisible();
//     // expect(cardDate).toBeVisible();
//     expect(cardImage).toBeVisible();

//     if (i === 0) {
//       await expect(cardName).toContainText(
//         '200 Years Journey Through Thai Modern Art History'
//       );
//     } else if (i === 1) {
//       await expect(cardName).toContainText('THAILAND ART & DESIGN EXHIBITION');
//     } else if (i === 2) {
//       await expect(cardName).toContainText('ART EXHIBITION 2024');
//     } else if (i === 3) {
//       await expect(cardName).toContainText('HOMECOMING');
//     } else if (i === 4) {
//     } else if (i === 5) {
//     } else if (i === 6) {
//     }
//   }
// });
