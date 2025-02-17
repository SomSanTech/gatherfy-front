import { test, expect } from '@playwright/test';

test('pbi14.1', async ({ page }) => {
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
    .first()
    .click();
  await page.getByText('Add Question', { exact: true }).click();
  await page.getByPlaceholder('Type your question').first().click();
  await page.getByPlaceholder('Type your question').first().fill('test');

  await page
    .getByRole('button', { name: 'Please select your question' })
    .first()
    .click();
  await page.getByRole('button', { name: 'Text' }).first().click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.reload();
  await page.waitForTimeout(3000);
  await page.getByPlaceholder('Type your question').first().click();
  await page.getByPlaceholder('Type your question').first().fill('test22');
  await page.getByRole('button', { name: 'Save' }).click();

  await page.reload();
});

test('pbi14.2', async ({ page }) => {
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
    .getByRole('row', {
      name: 'Paper Petals: Watercolor Flowers and Make a Bouquet Class',
    })
    .getByRole('link')
    .first()
    .click();
  await page.getByText('Add Question', { exact: true }).click();
  await page.getByPlaceholder('Type your question').first().click();
  await page.getByPlaceholder('Type your question').first().fill('test');

  await page
    .getByRole('button', { name: 'Please select your question' })
    .first()
    .click();
  await page.getByRole('button', { name: 'Text' }).first().click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.reload();
  await page.waitForTimeout(3000);
  await page.getByPlaceholder('Type your question').first().click();
  await page.getByPlaceholder('Type your question').first().fill('');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Question must not be blank'
  );
});
