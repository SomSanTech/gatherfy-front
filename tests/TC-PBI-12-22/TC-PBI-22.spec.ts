import { test, expect } from '@playwright/test';

test('pbi22.1', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('00K');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Ling0+7=7');
  await page.getByPlaceholder('Enter your password').press('Enter');
  await page.waitForTimeout(6000);
});

test('pbi22.2', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('mikasa');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Password');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(6000);
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'wrong username or password'
  );
});
test('pbi22.3', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('miksasa');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Password.1');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(6000);
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'wrong username or password'
  );
});
test('pbi22.4', async ({ page }) => {
  await page.goto('/');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(6000);
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Please enter your username.'
  );
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Please enter your password.'
  );
});
