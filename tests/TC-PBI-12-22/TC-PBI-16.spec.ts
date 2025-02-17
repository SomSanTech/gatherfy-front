import { test, expect } from '@playwright/test';

test('pbi16.1', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').fill('ormorm');
  await page.getByPlaceholder('Enter your password').fill('Orm6+5=11');
  await page.getByPlaceholder('Enter your password').press('Enter');

  await page.waitForTimeout(6000);
  await page.locator('img').first().click();
  await page.getByRole('button', { name: 'My Tickets' }).click();
  await page.getByRole('button', { name: 'Past event' }).click();

  await page.getByRole('button', { name: 'Review event' }).nth(3).click();
  await page
    .locator(
      'span:nth-child(3) > div > .nuxt-rating-star-svg > polygon:nth-child(3)'
    )
    .click();
  await page.getByPlaceholder('Leave your answer').click();
  await page.getByPlaceholder('Leave your answer').fill('Good');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText('Reviewed');
});

test('pbi16.2', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').fill('ormorm');
  await page.getByPlaceholder('Enter your password').fill('Orm6+5=11');
  await page.getByPlaceholder('Enter your password').press('Enter');

  await page.waitForTimeout(6000);
  await page.locator('img').first().click();
  await page.getByRole('button', { name: 'My Tickets' }).click();
  await page.getByRole('button', { name: 'Past event' }).click();

  await page.getByRole('button', { name: 'Review event' }).nth(2).click();

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Please answer all question'
  );
});
