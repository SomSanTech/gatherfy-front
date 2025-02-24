import { test, expect } from '@playwright/test';

test('pbi12.1', async ({ page }) => {
  await page.goto('/us1');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(3000);
  await page.getByPlaceholder('Username or Email').click();
  await page.getByPlaceholder('Username or Email').fill('00K');
  await page.getByPlaceholder('Username or Email').press('Tab');
  await page.getByPlaceholder('Enter your password').fill('Ling0+7=7');
  await page.getByPlaceholder('Enter your password').press('Enter');
  await page.getByRole('link', { name: 'Feedback' }).click();
  await expect(page.getByRole('heading')).toContainText('Feedback list');
  await expect(page.getByText('Feedback list Event Name Edit')).toBeVisible();
  await page
    .getByRole('row', { name: 'Watercolor Daily Diary 7' })
    .getByRole('link')
    .click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Watercolor Daily Diary'
  );
  await expect(page.locator('[id="__nuxt"]')).toContainText('Average Rating');
});

test('pbi12.2', async ({ page }) => {
  await page.goto('/us1');

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
    .getByRole('row', { name: 'Bangkok Music City – #BMC2025' })
    .getByRole('link')
    .nth(1)
    .click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Bangkok Music City – #BMC2025'
  );
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Awaiting feedback'
  );
});

// Playwright bug
// test('pbi12.3', async ({ page }) => {
//   await page.goto('/us1');

//   await page.waitForTimeout(3000);

//   await page.getByRole('button', { name: 'Sign in' }).click();
//   await page.waitForTimeout(3000);
//   await page.getByPlaceholder('Username or Email').click();
//   await page.getByPlaceholder('Username or Email').fill('00K');
//   await page.getByPlaceholder('Username or Email').press('Tab');
//   await page.getByPlaceholder('Enter your password').fill('Ling0+7=7');
//   await page.getByPlaceholder('Enter your password').press('Enter');

//   await page.waitForTimeout(6000);
//   await page.getByRole('link', { name: 'Feedback' }).click();

//   await page.goto('/backoffice/feedback/response/50');

//   await expect(page.locator('[id="__nuxt"]')).toContainText(
//     'The page you are looking for cannot be found'
//   );
// });
