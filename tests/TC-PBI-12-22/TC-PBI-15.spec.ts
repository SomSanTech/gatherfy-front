import { test, expect } from '@playwright/test';

test('pbi15.1', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(3000);
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('00K');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Ling0+7=7');
  await page.getByPlaceholder('Enter your password').press('Enter');

  await page.waitForTimeout(6000);

  await page.getByRole('link', { name: 'Feedback' }).click();
  await page
    .getByRole('row', { name: 'Ceramic Workshop 20 March' })
    .getByRole('link')
    .first()
    .click();
  await page.locator('.relative > svg').first().click();
  await page.getByRole('button', { name: "Yes, I'm sure" }).click();

  await page.reload();
});

test('pbi15.2', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(3000);
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('00K');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Ling0+7=7');
  await page.getByPlaceholder('Enter your password').press('Enter');

  await page.waitForTimeout(6000);

  await page.getByRole('link', { name: 'Feedback' }).click();
  await page
    .getByRole('row', { name: 'Ceramic Workshop 20 March' })
    .getByRole('link')
    .first()
    .click();
  await page.locator('.relative > svg').click();
  await page.getByRole('button', { name: 'No, cancel' }).click();

  await page.reload();
});
