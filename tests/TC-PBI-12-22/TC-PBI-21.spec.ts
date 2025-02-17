import { test, expect } from '@playwright/test';

test('pbi21.3', async ({ page }) => {
  await page.goto('/us1');

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.getByPlaceholder('First name').fill('test');
  await page.getByPlaceholder('Last name').fill('test');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('thaksaporn9667@gmail.com');
  await page.getByPlaceholder('Phone').fill('0988887766');
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('testet');
  await page.getByPlaceholder('Enter your password').fill('Papoi+123');
  await page.getByPlaceholder('Enter your password').press('Tab');
  await page.locator('.relative > .absolute').first().press('Tab');
  await page.getByPlaceholder('Confirm your password').fill('Papoi+123');
  await page.locator('#birthday').fill('2025-02-04');
  await page
    .getByRole('button', { name: 'For users who want to explore' })
    .click();
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Email already taken'
  );
});

test('pbi21.4', async ({ page }) => {
  await page.goto('/us1');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.getByPlaceholder('First name').fill('test');
  await page.getByPlaceholder('Last name').fill('test');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('thaksaporn96367@gmail.com');
  await page.getByPlaceholder('Phone').fill('0988887766');
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('testet');
  await page.getByPlaceholder('Enter your password').fill('Papoi');
  await page.getByPlaceholder('Enter your password').press('Tab');
  await page.locator('.relative > .absolute').first().press('Tab');
  await page.getByPlaceholder('Confirm your password').fill('Papoi');
  await page.locator('#birthday').fill('2025-02-04');
  await page
    .getByRole('button', { name: 'For users who want to explore' })
    .click();
  await page.getByRole('button', { name: 'Sign Up' }).click();

  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Passwords do not match or fail to meet the requirements.'
  );
});
test('pbi22.3', async ({ page }) => {
  await page.goto('/us1');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.getByPlaceholder('First name').fill('test');
  await page.getByPlaceholder('Last name').fill('test');

  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Please enter your username.'
  );
});
