import { test, expect } from '@playwright/test';

test('TC-PBI-2.1 go to event detail', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);

  const goHomeBtn = await page.locator('.go-home-btn');

  const eventName = await page.locator('.event-name');
  const eventNameText = await eventName.innerText();
  console.log('eventNameText', eventNameText);

  const joinButton = await page.locator('button', { hasText: 'Join now' });
  joinButton.click();

  await page.waitForTimeout(3000);

  const detailName = await page.locator('.detail-name');
  const detailNameText = await detailName.innerText();
  console.log('detailNameText', detailNameText);

  expect(eventNameText).toEqual(detailNameText);
  await expect(detailName).toBeVisible();
  await expect(page.locator('.detail-img')).toBeVisible();
  await expect(page.locator('.detail-owner')).toBeVisible();
  await expect(page.locator('.detail-time')).toBeVisible();
  await expect(page.locator('.detail-date')).toBeVisible();
  await expect(page.locator('.detail-location')).toBeVisible();
  await expect(page.locator('.detail-tag').first()).toBeVisible();

  const section = page.locator('div#content');
  await section.scrollIntoViewIfNeeded();

  await expect(page.locator('.detail-map').first()).toBeVisible();
  await expect(page.locator('.detail-detail').first()).toBeVisible();
  await expect(page.locator('.tag-group').first()).toBeVisible();

  goHomeBtn.click();
  const prevButton = await page.locator('.recommended-btn-prev');
  prevButton.click();
  await page.waitForTimeout(2000);

  const recomName = await page.locator('.reccom-name');
  const recomNameText = await recomName.innerText();
  console.log('eventNameText', eventNameText);

  const regisButton = await page.locator('button', { hasText: 'Registor now' });
  regisButton.click();

  await page.waitForTimeout(3000);

  const detailNameRecom = await page.locator('.detail-name');
  const detailNameTextRecom = await detailNameRecom.innerText();
  console.log('detailNameText', detailNameText);

  expect(recomNameText).toEqual(detailNameTextRecom);
  await expect(detailNameRecom).toBeVisible();
  await expect(page.locator('.detail-img')).toBeVisible();
  await expect(page.locator('.detail-owner')).toBeVisible();
  await expect(page.locator('.detail-time')).toBeVisible();
  await expect(page.locator('.detail-date')).toBeVisible();
  await expect(page.locator('.detail-location')).toBeVisible();
  await expect(page.locator('.detail-tag').first()).toBeVisible();

  // const section = page.locator('div#content');
  await section.scrollIntoViewIfNeeded();

  await expect(page.locator('.detail-map').first()).toBeVisible();
  await expect(page.locator('.detail-detail').first()).toBeVisible();
  await expect(page.locator('.tag-group').first()).toBeVisible();

  goHomeBtn.click();

  const sectionTime = page.locator('div#time-list');
  await sectionTime.scrollIntoViewIfNeeded();
  await page.waitForSelector('.btn');

  const todayEventBtn = await page.locator('button', {
    hasText: 'Today event',
  });
  const upcomeEventBtn = await page.locator('button', {
    hasText: 'Upcoming event',
  });

  upcomeEventBtn.click();
  await page.waitForTimeout(3000);
  const eventCard = await page.locator('.event-card').first();
  const eventCardName = await page.locator('.event-card-name').first();
  const eventCardNameText = await eventCardName.innerText();

  eventCard.click();
  await page.waitForTimeout(3000);
  const detailNameCard = await page.locator('.detail-name');
  const detailNameTextCard = await detailNameCard.innerText();
  console.log('detailNameText', detailNameText);

  expect(eventCardNameText).toEqual(detailNameTextCard);
  await expect(detailNameCard).toBeVisible();
  await expect(page.locator('.detail-img')).toBeVisible();
  await expect(page.locator('.detail-owner')).toBeVisible();
  await expect(page.locator('.detail-time')).toBeVisible();
  await expect(page.locator('.detail-date')).toBeVisible();
  await expect(page.locator('.detail-location')).toBeVisible();
  await expect(page.locator('.detail-tag').first()).toBeVisible();

  // const section = page.locator('div#content');
  await section.scrollIntoViewIfNeeded();

  await expect(page.locator('.detail-map').first()).toBeVisible();
  await expect(page.locator('.detail-detail').first()).toBeVisible();
  await expect(page.locator('.tag-group').first()).toBeVisible();
});

test('TC-PBI-2.2 go to event detail by url', async ({ page }) => {
  await page.goto('us1/event/tech-conference-2024');
  await page.waitForTimeout(3000);

  await expect(page.locator('.detail-name')).toBeVisible();
  await expect(page.locator('.detail-img')).toBeVisible();
  await expect(page.locator('.detail-owner')).toBeVisible();
  await expect(page.locator('.detail-time')).toBeVisible();
  await expect(page.locator('.detail-date')).toBeVisible();
  await expect(page.locator('.detail-location')).toBeVisible();
  await expect(page.locator('.detail-tag').first()).toBeVisible();

  const section = page.locator('div#content');
  await section.scrollIntoViewIfNeeded();

  await expect(page.locator('.detail-map').first()).toBeVisible();
  await expect(page.locator('.detail-detail').first()).toBeVisible();
  await expect(page.locator('.tag-group').first()).toBeVisible();
});

test('TC-PBI-2.3 can not go to event detail by url', async ({ page }) => {
  await page.goto('us1/event/ling-orm-fanmeet');
  await page.waitForTimeout(3000);

  await expect(page.locator('.error-text')).toContainText(
    'The page you are looking for cannot be found'
  );
});
