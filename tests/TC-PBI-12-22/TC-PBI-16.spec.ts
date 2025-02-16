// import { test, expect } from '@playwright/test';

// test('pbi16.1', async ({ page }) => {
//   await page.goto('/');

//   await page.waitForTimeout(3000);

//   await page.getByRole('button', { name: 'Sign in' }).click();
//   await page.getByPlaceholder('Username or Email').fill('ormorm');
//   await page.getByPlaceholder('Enter your password').fill('Orm6+5=11');
//   await page.getByPlaceholder('Enter your password').press('Enter');

//   await page.waitForTimeout(6000);
//   await page.locator('img').first().click();
//   await page.getByRole('button', { name: 'My Tickets' }).click();
//   await page.getByRole('button', { name: 'Past event' }).click();

//   // ✅ ตรวจสอบก่อนว่าปุ่มมีอยู่หรือไม่
//   const reviewButton = page.locator('button:has-text("Review event")').first();
//   // await expect(reviewButton).toBeVisible({ timeout: 10000 });

//   await reviewButton.click();

//   await page.locator('span:nth-child(3) > div > .nuxt-rating-star-svg > polygon:nth-child(3)').first().click();
//   await page.getByPlaceholder('Leave your answer').nth(0).fill('Timing');
//   await page.getByPlaceholder('Leave your answer').nth(1).fill('Workshop');
//   await page.getByPlaceholder('Leave your answer').nth(2).fill('Good event!');

//   await page.getByRole('button', { name: 'Submit' }).click();
//   await expect(page.locator('[id="__nuxt"]')).toContainText('Reviewed');
// });

// test('pbi16.2', async ({ page }) => {
//   await page.goto('/');

//   await page.waitForTimeout(3000);

//   await page.getByRole('button', { name: 'Sign in' }).click();
//   await page.getByPlaceholder('Username or Email').fill('ormorm');
//   await page.getByPlaceholder('Enter your password').fill('Orm6+5=11');
//   await page.getByPlaceholder('Enter your password').press('Enter');

//   await page.waitForTimeout(6000);
//   await page.locator('img').first().click();
//   await page.getByRole('button', { name: 'My Tickets' }).click();
//   await page.getByRole('button', { name: 'Past event' }).click();

//   // ✅ ตรวจสอบก่อนว่าปุ่มมีอยู่หรือไม่
//   const reviewButton = page.locator('button:has-text("Review event")');
//   await expect(reviewButton).toBeVisible({ timeout: 10000 });

//   await reviewButton.first().click();
//   await page.getByRole('button', { name: 'Submit' }).click();
//   await expect(page.locator('[id="__nuxt"]')).toContainText('Please answer all question');
// });
