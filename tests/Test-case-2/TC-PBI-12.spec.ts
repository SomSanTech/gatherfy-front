import { test, expect } from '@playwright/test';

test('12.1', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('00K');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Ling0+7=7');
  await page.getByPlaceholder('Enter your password').press('Enter');
  await page.getByRole('link', { name: 'Feedback' }).click();
  await page
    .getByRole('row', { name: 'Music Festival 2025 5' })
    .getByRole('link')
    .click();
  await expect(page.getByText('Average Rating')).toBeVisible();
});
