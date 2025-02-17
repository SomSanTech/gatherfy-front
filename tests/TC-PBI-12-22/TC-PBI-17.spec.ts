import { test, expect } from '@playwright/test';

test('pbi17.1', async ({ page }) => {
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
  await page.getByRole('heading', { name: 'Event list' }).click({
    button: 'right',
  });
  await expect(page.getByRole('heading', { name: 'Event list' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Event Name' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Location' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Action' })).toBeVisible();
});

test('pbi17.2', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('mikasa');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Password.1');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('link', { name: 'Events' }).click();
  await expect(page.getByRole('cell', { name: 'No Event' })).toBeVisible();
});
