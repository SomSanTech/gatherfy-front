import { test, expect } from '@playwright/test';

// test('pbi18.1', async ({ page }) => {
//   await page.goto('/us1');

//   await page.waitForTimeout(3000);

//   await page.getByRole('button', { name: 'Sign in' }).click();
//   await page.getByPlaceholder('Username or Email').click();
//   await page.getByPlaceholder('Username or Email').fill('00K');
//   await page.getByPlaceholder('Username or Email').press('Tab');
//   await page.getByPlaceholder('Enter your password').fill('Ling0+7=7');
//   await page.getByPlaceholder('Enter your password').press('Enter');
//   await page.waitForTimeout(6000);
//   await page.getByRole('link', { name: 'Events' }).click();
//   await page.getByRole('button', { name: 'Create event' }).click();
//   await page.getByPlaceholder('Enter event name').fill('Attack on Titan Symphony');
//   await page.locator('input[type="text"]').nth(1).fill('attack-on-titan-symphony');
//   await page.getByPlaceholder('+ Add tag').click();
//   await page.getByRole('button', { name: 'Entertainment' }).click();
//   await page.locator('div:nth-child(5)').click();
//   await page.getByPlaceholder('Enter event description').fill('test');
//   await page.getByPlaceholder('Enter event detail').fill('test');
//   await page.locator('input[type="date"]').first().fill('2025-02-19');
//   await page.locator('input[type="time"]').first().click();
//   await page.locator('input[type="time"]').first().press('ArrowLeft');
//   await page.locator('input[type="time"]').first().press('ArrowLeft');
//   await page.locator('input[type="time"]').first().fill('11:11');
//   await page.locator('input[type="date"]').nth(1).fill('2025-02-20');
//   await page.locator('input[type="time"]').nth(1).click();
//   await page.locator('input[type="time"]').nth(1).press('ArrowLeft');
//   await page.locator('input[type="time"]').nth(1).press('ArrowLeft');
//   await page.locator('input[type="time"]').nth(1).fill('11:11');
//   await page.locator('input[type="date"]').nth(2).fill('2025-02-24');
//   await page.locator('input[type="time"]').nth(2).click();
//   await page.locator('input[type="time"]').nth(2).press('ArrowLeft');
//   await page.locator('input[type="time"]').nth(2).press('ArrowLeft');
//   await page.locator('input[type="time"]').nth(2).fill('11:11');
//   await page.locator('input[type="date"]').nth(3).fill('2025-02-26');
//   await page.locator('input[type="time"]').nth(3).click();
//   await page.locator('input[type="time"]').nth(3).press('ArrowLeft');
//   await page.locator('input[type="time"]').nth(3).press('ArrowLeft');
//   await page.locator('input[type="time"]').nth(3).press('ArrowLeft');
//   await page.locator('input[type="time"]').nth(3).fill('11:11');
//   await page.getByPlaceholder('The maximum number of people').fill('1000');
//   await page.getByPlaceholder('Registration goal for').click();
//   await page.getByPlaceholder('Registration goal for').fill('100');
//   await page.getByPlaceholder('Enter location name').fill('Bangkok');
//   await page.getByPlaceholder('<iframe src="https://www.').click();
//   await page.getByPlaceholder('<iframe src="https://www.').click();
//   await page.getByPlaceholder('<iframe src="https://www.').fill('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248057.55643873452!2d100.46830564959495!3d13.724544920926544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d630d80329d73%3A0x5d1594b915327b6c!2z4LiL4Liy4Lif4Liy4Lij4Li14LmA4Lin4Li04Lil4LiU4LmMIOC4geC4o-C4uOC4h-C5gOC4l-C4ng!5e0!3m2!1sth!2sth!4v1739724926253!5m2!1sth!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>');
//   await page.goto('https://capstone24.sit.kmutt.ac.th/us1/backoffice/events');
//   await expect(page.getByRole('cell', { name: 'Attack on Titan Symphony' })).toBeVisible();
// });

test('pbi18.2', async ({ page }) => {
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
  await page.getByRole('button', { name: 'Create event' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    '*Please enter the event name.'
  );
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    '*Please provide a short event description.'
  );
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    '*Please upload a valid image.'
  );
});
