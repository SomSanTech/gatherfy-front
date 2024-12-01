import { test, expect } from '@playwright/test';

test('TC-PBI-9.1 admin edit status to check-in', async ({ page }) => {
  await page.goto('http://localhost:3000/backoffice');

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
    console.log('choiceText', await choiceText);

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
  await page.goto('http://localhost:3000/backoffice');

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
    console.log('choiceText', await choiceText);

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
  await page.goto('http://localhost:3000/backoffice');

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
    console.log('choiceText', await choiceText);

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
// test('TC-PBI-8.2 admin view all registration', async ({ page }) => {
//   await page.goto('http://localhost:3000/backoffice');

//   await page.getByRole('button', { name: 'Registration' }).click();
//   await page.waitForTimeout(3000);

//   await page.getByRole('link', { name: 'Event Registration' }).click();
//   await page.waitForTimeout(3000);

//   await page.getByRole('link', { name: '200 Years Journey Through' }).click();
//   await page.waitForTimeout(3000);

//   await expect(page.locator('.back-regis-title ')).toContainText(
//     'All Registrations'
//   );

//   // check table field name
//   await expect(page.locator('.regis-list-name ')).toContainText(
//     'Attendees Name'
//   );
//   await expect(page.locator('.regis-list-phone ')).toContainText(
//     'Phone Number'
//   );
//   await expect(page.locator('.regis-list-email ')).toContainText('Email');
//   await expect(page.locator('.regis-list-event-name ')).toContainText('Event');
//   await expect(page.locator('.regis-list-status ')).toContainText('Status');

//   const regisList = page.locator('.regis-list');

//   const regisCount = await regisList.count();
//   expect(regisCount).toBe(43);

//   // check data in table is exist
//   for (let i = 0; i < regisCount; ++i) {
//     const card = regisList.nth(i);
//     expect(card.locator('.back-regis-name')).toContainText(
//       '200 Years Journey Through Thai Modern Art History'
//     );
//     expect(card.locator('.back-regis-phone')).toBeVisible();
//     expect(card.locator('.back-regis-email')).toBeVisible();
//     expect(card.locator('.back-regis-event-name')).toBeVisible();
//     expect(card.locator('.back-regis-status')).toBeVisible();
//   }
// });

// test('TC-PBI-8.3 admin edit status', async ({ page }) => {
//   await page.goto('http://localhost:3000/backoffice');
//   await page.getByRole('button', { name: 'Registration' }).click();
//   await page.waitForTimeout(3000);

//   await page.getByRole('link', { name: 'All Registration' }).click();
//   await page.waitForTimeout(3000);

//   await expect(page.locator('.back-regis-title ')).toContainText(
//     'All Registrations'
//   );

//   await page.locator('.regis-edit').first().click();
//   await page.waitForTimeout(3000);

//   // const regisCount = await regisList.count();
//   // expect(regisCount).toBe(43);

//   // check data in detail is exist
//   expect(page.locator('.regis-detail-title')).toContainText(
//     'Registrations Detail'
//   );
//   expect(page.locator('.regis-detail-event-name')).toBeVisible();
//   expect(page.locator('.regis-detail-firstname')).toBeVisible();
//   expect(page.locator('.regis-detail-lastname')).toBeVisible();
//   expect(page.locator('.regis-detail-username')).toBeVisible();
//   expect(page.locator('.regis-detail-email')).toBeVisible();
//   expect(page.locator('.regis-detail-phone')).toBeVisible();
//   expect(page.locator('.regis-detail-gender')).toBeVisible();
//   expect(page.locator('.regis-detail-status')).toBeVisible();

//   // ----------------------------------------------------------------------------

//   await page.goto('http://localhost:3000/backoffice');

//   await page.getByRole('button', { name: 'Registration' }).click();
//   await page.waitForTimeout(3000);

//   await page.getByRole('link', { name: 'Event Registration' }).click();
//   await page.waitForTimeout(3000);

//   await page.getByRole('link', { name: '200 Years Journey Through' }).click();
//   await page.waitForTimeout(3000);

//   await expect(page.locator('.back-regis-title ')).toContainText(
//     'Event Registration'
//   );

//   // check table field name
//   // await expect(page.locator('.regis-list-name ')).toContainText(
//   //   'Attendees Name'
//   // );
//   // await expect(page.locator('.regis-list-phone ')).toContainText(
//   //   'Phone Number'
//   // );
//   // await expect(page.locator('.regis-list-email ')).toContainText('Email');
//   // await expect(page.locator('.regis-list-event-name ')).toContainText('Event');
//   // await expect(page.locator('.regis-list-status ')).toContainText('Status');

//   // const regisList = page.locator('.regis-list');
//   await page.locator('.regis-edit').first().click();
//   await page.waitForTimeout(3000);

//   // const regisCount = await regisList.count();
//   // expect(regisCount).toBe(43);

//   // check data in detail is exist
//   expect(page.locator('.regis-detail-title')).toContainText(
//     'Registrations Detail'
//   );
//   expect(page.locator('.regis-detail-event-name')).toBeVisible();
//   expect(page.locator('.regis-detail-firstname')).toBeVisible();
//   expect(page.locator('.regis-detail-lastname')).toBeVisible();
//   expect(page.locator('.regis-detail-username')).toBeVisible();
//   expect(page.locator('.regis-detail-email')).toBeVisible();
//   expect(page.locator('.regis-detail-phone')).toBeVisible();
//   expect(page.locator('.regis-detail-gender')).toBeVisible();
//   expect(page.locator('.regis-detail-status')).toBeVisible();
// });

// test('TC-PBI-8.4 admin no event', async ({ page }) => {
//   await page.goto('http://localhost:3000/backoffice');
//   await page.getByRole('button', { name: 'Registration' }).click();
//   await page.waitForTimeout(3000);

//   await page.getByRole('link', { name: 'All Registration' }).click();
//   await page.waitForTimeout(3000);

//   await expect(page.locator('.back-regis-title ')).toContainText(
//     'All Registrations'
//   );
//   await expect(page.locator('.error-text')).toContainText('No Registration');
// });

// test('TC-PBI-8.ถ admin no regis detail', async ({ page }) => {
//   await page.goto('http://localhost:3000/backoffice/registrations/99');
//   await page.waitForTimeout(3000);

//   await expect(page.locator('.error-text')).toContainText(
//     'The page you are looking for cannot be found'
//   );
// });
