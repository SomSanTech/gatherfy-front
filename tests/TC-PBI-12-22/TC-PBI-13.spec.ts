import { test, expect } from '@playwright/test';

test('pbi13.1', async ({ page }) => {
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

  await page.getByRole('link', { name: 'Events' }).click();
  await page
    .getByRole('row', { name: 'Orm Korn‘s Graduation Gathering' })
    .getByRole('link')
    .click();
  await page.getByRole('button', { name: 'Manage Feedback' }).click();
  await page.getByText('Add Question', { exact: true }).click();
  await page.getByPlaceholder('Type your question').click();
  await page.getByPlaceholder('Type your question').fill('Test text');
  await page
    .getByRole('button', { name: 'Please select your question' })
    .click();
  await page.getByRole('button', { name: 'Text' }).click();
  await page.getByText('Add Question', { exact: true }).click();
  await page.getByPlaceholder('Type your question').nth(1).click();
  await page.getByPlaceholder('Type your question').nth(1).fill('Test Rating');
  await page
    .getByRole('button', { name: 'Please select your question' })
    .click();
  await page.getByRole('button', { name: 'Rating (1-5)' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
});

test('pbi13.2', async ({ page }) => {
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

  await page.getByRole('link', { name: 'Events' }).click();
  await page
    .getByRole('row', { name: 'Orm Korn‘s Graduation Gathering' })
    .getByRole('link')
    .click();
  await page.getByRole('button', { name: 'Manage Feedback' }).click();
  await page.getByText('Add Question', { exact: true }).click();
  await page
    .getByRole('button', { name: 'Please select your question' })
    .click();
  await page
    .locator('button')
    .filter({ hasText: /^Text$/ })
    .click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Question must not be blank'
  );
});
