import { test, expect } from '@playwright/test';

test('pbi20.1', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('00K');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Ling0+7=7');
  await page.getByPlaceholder('Enter your password').press('Enter');
  await page.waitForTimeout(6000);

  await page.getByRole('link', { name: 'Events' }).click();
  await page
    .getByRole('row', { name: 'test delete 2 test' })
    .locator('path')
    .nth(1)
    .click();
  await page.getByRole('button', { name: 'Yes, Delete!' }).click();
});
