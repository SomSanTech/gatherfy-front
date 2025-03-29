import { test, expect } from '@playwright/test';

test('TC-PBI-9.1 admin edit status to check-in', async ({ page }) => {
  await page.goto('/us1/backoffice');

  await page.getByRole('button', { name: 'Registration' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('link', { name: 'All Registration' }).click();
  await page.waitForTimeout(3000);

  await page.locator('.regis-edit').first().click();
  await page.waitForTimeout(3000);

  await page.locator('.regis-detail-status').click({ force: true });
  await page.waitForSelector('button.status-choice');
  await page.waitForTimeout(3000);
  // await page.locator('button.status-choice', { hasText: /Check\s?in/ }).click({force:true});

  const statusChoice = page.locator('.status-choice');

  // const sectionCard = page.locator('div#time-list-card');
  // await sectionCard.scrollIntoViewIfNeeded();
  const statusChoiceCount = await statusChoice.count();
  // expect(cardCount).toBe(3);

  for (let i = 0; i < statusChoiceCount; ++i) {
    const choice = statusChoice.nth(i);
    const choiceText = await choice.innerText();

    if ((await choiceText) === 'Checked in') {
      await choice.click();
    }
  }

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(3000);

  await expect(page.locator('.alert-text')).toContainText(
    'Status has been updated'
  );

  await page.getByRole('link', { name: 'Back to registration list' }).click();

  await expect(page.locator('.back-regis-status').first()).toContainText(
    'Checked in'
  );
});

test('TC-PBI-9.2 admin edit status to Unattended', async ({ page }) => {
  await page.goto('/us1/backoffice');

  await page.getByRole('button', { name: 'Registration' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('link', { name: 'All Registration' }).click();
  await page.waitForTimeout(3000);

  await page.locator('.regis-edit').last().click();
  await page.waitForTimeout(3000);

  await page.locator('.regis-detail-status').click({ force: true });
  await page.waitForSelector('button.status-choice');
  await page.waitForTimeout(3000);
  // await page.locator('button.status-choice', { hasText: /Check\s?in/ }).click({force:true});

  const statusChoice = page.locator('.status-choice');

  // const sectionCard = page.locator('div#time-list-card');
  // await sectionCard.scrollIntoViewIfNeeded();
  const statusChoiceCount = await statusChoice.count();
  // expect(cardCount).toBe(3);

  for (let i = 0; i < statusChoiceCount; ++i) {
    const choice = statusChoice.nth(i);
    const choiceText = await choice.innerText();

    if ((await choiceText) === 'Unattended') {
      await choice.click();
      return;
    }
  }

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(3000);

  await expect(page.locator('.alert-text')).toContainText(
    'Status has been updated'
  );

  await page.getByRole('link', { name: 'Back to registration list' }).click();

  await expect(page.locator('.back-regis-status').last()).toContainText(
    'Unattended'
  );
});

test('TC-PBI-9.3 admin edit status to Unattended', async ({ page }) => {
  await page.goto('/us1/backoffice');

  await page.getByRole('button', { name: 'Registration' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('link', { name: 'All Registration' }).click();
  await page.waitForTimeout(3000);

  await page.locator('.regis-edit').first().click();
  await page.waitForTimeout(3000);

  await page.locator('.regis-detail-status').click({ force: true });
  await page.waitForSelector('button.status-choice');
  await page.waitForTimeout(3000);
  // await page.locator('button.status-choice', { hasText: /Check\s?in/ }).click({force:true});

  const statusChoice = page.locator('.status-choice');

  // const sectionCard = page.locator('div#time-list-card');
  // await sectionCard.scrollIntoViewIfNeeded();
  const statusChoiceCount = await statusChoice.count();
  // expect(cardCount).toBe(3);

  for (let i = 0; i < statusChoiceCount; ++i) {
    const choice = statusChoice.nth(i);
    const choiceText = await choice.innerText();

    if ((await choiceText) === 'Unattended') {
      await choice.click();
      return;
    }
  }

  // await page.getByRole('button', { name: 'Save' }).click();

  // await expect(page.locator('.alert-text')).toContainText(
  //   'Status has been updated'
  // );

  await page.getByRole('link', { name: 'Back to registration list' }).click();

  await page.waitForTimeout(3000);

  await expect(
    await page.locator('.back-regis-status').first().innerText()
  ).toEqual('Checked in');
});
