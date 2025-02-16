import { test, expect } from '@playwright/test';

test('TC-PBI-7.1 not click regis', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);

  const eventName = await page.locator('.event-name');
  const eventNameText = await eventName.innerText();
  const joinButton = await page.locator('button', { hasText: 'Join now' });
  joinButton.click();

  await page.waitForTimeout(3000);

  const detailName = await page.locator('.detail-name');
  const detailNameText = await detailName.innerText();
  console.log('detailNameText', detailNameText);

  expect(eventNameText).toEqual(detailNameText);

  await page.getByRole('button', { name: 'Registor event' }).click();

  page.on('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    expect(dialog.message()).toBe('Thank you for registration'); // ตรวจสอบข้อความ
    await dialog.accept();
  });

  await expect(page.locator('.regis-popup')).toBeVisible();

  await expect(page.locator('.regis-name')).toBeVisible();
  await expect(page.locator('.regis-date')).toBeVisible();
  await expect(page.locator('.regis-time')).toBeVisible();
  await expect(page.locator('.regis-user')).toBeVisible();

  await page.locator('.close-popup').click();

  await expect(page.locator('.regis-popup')).toBeHidden();

  // await page.getByRole('button', { name: 'One-click Register' }).click();
});

test('TC-PBI-7.2 regis', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);

  const eventName = await page.locator('.event-name');
  const eventNameText = await eventName.innerText();
  const joinButton = await page.locator('button', { hasText: 'Join now' });
  joinButton.click();

  await page.waitForTimeout(3000);

  const detailName = await page.locator('.detail-name');
  const detailNameText = await detailName.innerText();
  console.log('detailNameText', detailNameText);
  await page.waitForTimeout(3000);

  expect(eventNameText).toEqual(detailNameText);

  await page.getByRole('button', { name: 'Registor event' }).click();

  page.on('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    // expect(dialog.message()).toContain('Already Registered for the Event');
    expect(dialog.message()).toContain('Thank you for registration');
    await dialog.accept();
  });

  await expect(page.locator('.regis-popup')).toBeVisible();

  await expect(page.locator('.regis-name')).toBeVisible();
  await expect(page.locator('.regis-date')).toBeVisible();
  await expect(page.locator('.regis-time')).toBeVisible();
  await expect(page.locator('.regis-user')).toBeVisible();

  // await page.locator('.close-popup').click();

  // await expect(page.locator('.regis-popup')).toBeHidden()

  await page.getByRole('button', { name: 'One-click Register' }).click();
});

test('TC-PBI-7.3 regis again', async ({ page }) => {
  await page.goto('/us1');
  await page.waitForTimeout(3000);

  const eventName = await page.locator('.event-name');
  const eventNameText = await eventName.innerText();
  const joinButton = await page.locator('button', { hasText: 'Join now' });
  joinButton.click();

  await page.waitForTimeout(3000);

  const detailName = await page.locator('.detail-name');
  const detailNameText = await detailName.innerText();
  console.log('detailNameText', detailNameText);
  await page.waitForTimeout(3000);

  expect(eventNameText).toEqual(detailNameText);

  await page.getByRole('button', { name: 'Registor event' }).click();

  page.on('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    expect(dialog.message()).toContain('Already Registered for the Event');
    // expect(dialog.message()).toContain('Thank you for registration');
    await dialog.accept();
  });

  await expect(page.locator('.regis-popup')).toBeVisible();

  await expect(page.locator('.regis-name')).toBeVisible();
  await expect(page.locator('.regis-date')).toBeVisible();
  await expect(page.locator('.regis-time')).toBeVisible();
  await expect(page.locator('.regis-user')).toBeVisible();

  // await page.locator('.close-popup').click();

  // await expect(page.locator('.regis-popup')).toBeHidden()

  await page.getByRole('button', { name: 'One-click Register' }).click();
});
