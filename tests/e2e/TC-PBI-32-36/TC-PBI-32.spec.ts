import { test, expect } from '@playwright/test';

test('Login with google', async ({ page }) => {
  await page.goto('https://capstone24.sit.kmutt.ac.th/us1/');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Sign in' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.waitForTimeout(3000);

  await page
    .locator('iframe[title="ปุ่มลงชื่อเข้าใช้ด้วย Google"]')
    .contentFrame()
    .getByRole('button', { name: 'ลงชื่อเข้าใช้ด้วย Google' })
    .click();
  await page.waitForTimeout(3000);

  const page1 = await page1Promise;
  await page1.getByRole('textbox', { name: 'Email or phone' }).click();
  await page1
    .getByRole('textbox', { name: 'Email or phone' })
    .fill('chonticha.it@mail.kmutt.ac.th');
  await page1.getByRole('button', { name: 'Next' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1
    .getByRole('textbox', { name: 'Enter your password' })
    .fill('0925996241_Pui');
  await page1.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(8000);
});

test('Edit user profile', async ({ page }) => {
  await page.goto('https://capstone24.sit.kmutt.ac.th/us1/');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).fill('ormorm');
  await page.getByRole('textbox', { name: 'Username or Email' }).press('Tab');
  await page
    .getByRole('textbox', { name: 'Enter your password' })
    .fill('Orm6+5=11');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(8000);

  await page.locator('img').first().click();
  await page.waitForTimeout(8000);

  await page.getByRole('button', { name: 'My Profile' }).click();
  await page.waitForTimeout(8000);
  await page.getByRole('textbox', { name: 'Phone' }).click();
  await page.getByRole('textbox', { name: 'Phone' }).fill('0987765543');
  await page
    .locator('div')
    .filter({
      hasText: /^GenderSelect GenderMaleFemaleOtherPrefer not to say$/,
    })
    .getByRole('combobox')
    .selectOption('Male');
  await page.getByRole('textbox', { name: 'Lastname' }).click();
  await page.getByRole('textbox', { name: 'Lastname' }).fill('Sethratanapongs');
  await page.getByRole('textbox', { name: 'Firstname' }).click();
  await page.getByRole('textbox', { name: 'Firstname' }).fill('Kornnaphats');
  await page.getByRole('button', { name: 'Save' }).first().click();
  await expect(page.getByText('Update profile successOK')).toBeVisible();
  await expect(page.locator('[id="__nuxt"]')).toContainText(
    'Update profile success'
  );
});

test('Change password fail', async ({ page }) => {
  await page.goto('https://capstone24.sit.kmutt.ac.th/us1/');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).fill('ormorm');
  await page.getByRole('textbox', { name: 'Username or Email' }).press('Tab');
  await page
    .getByRole('textbox', { name: 'Enter your password' })
    .fill('Orm6+5=11');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(8000);
  await page.locator('img').first().click();
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'My Profile' }).click();
  await page.waitForTimeout(8000);
  await page.getByRole('textbox', { name: 'current password' }).click();
  await page
    .getByRole('textbox', { name: 'current password' })
    .fill('Orm6+5=11');
  await page.getByRole('textbox', { name: 'new password' }).click();
  await page.getByRole('textbox', { name: 'current password' }).click();
  await page.getByRole('textbox', { name: 'current password' }).fill('Orm6+5=');
  await page.getByRole('textbox', { name: 'new password' }).click();
  await page.getByRole('textbox', { name: 'new password' }).fill('Orm6+5=11');
  await page.getByRole('button', { name: 'Save' }).nth(2).click();
  // await page.waitForTimeout(8000);

  // await expect(
  //   page.getByText('Current password is not correct')
  // ).toBeVisible({ timeout: 10000 }); // ✅ รอได้นานสุด 10 วินาที

  // await page.getByRole('button', { name: 'OK' }).nth(1).click();
});

test('Add social', async ({ page }) => {
  await page.goto('https://capstone24.sit.kmutt.ac.th/us1/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).fill('ormorm');
  await page.getByRole('textbox', { name: 'Username or Email' }).press('Tab');
  await page
    .getByRole('textbox', { name: 'Enter your password' })
    .fill('Orm6+5=11');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(8000);
  await page.locator('img').first().click();
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'My Profile' }).click();
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'My Profile' }).click();
  await page.getByRole('textbox', { name: 'Insert your link' }).first().click();
  await page
    .getByRole('textbox', { name: 'Insert your link' })
    .first()
    .fill('https://www.instagram.com/orm.kornnaphat');
  await page.getByRole('button', { name: 'Save' }).nth(1).click();
  await expect(page.getByText('Add social success')).toBeVisible();
});

test('Delete and Add social', async ({ page }) => {
  await page.goto('https://capstone24.sit.kmutt.ac.th/us1/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).fill('ormorm');
  await page.getByRole('textbox', { name: 'Username or Email' }).press('Tab');
  await page
    .getByRole('textbox', { name: 'Enter your password' })
    .fill('Orm6+5=11');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(8000);
  await page.locator('img').first().click();
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'My Profile' }).click();
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'My Profile' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
  await page.getByRole('textbox', { name: 'Insert your link' }).first().click();
  await page
    .getByRole('textbox', { name: 'Insert your link' })
    .first()
    .fill('https://x.com/ormmormm');
  await page.getByRole('button', { name: 'Save' }).nth(1).click();
  await expect(page.getByText('Add social success')).toBeVisible();
});

test('Delete contact', async ({ page }) => {
  await page.goto('https://capstone24.sit.kmutt.ac.th/us1/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).fill('ormorm');
  await page.getByRole('textbox', { name: 'Username or Email' }).press('Tab');
  await page
    .getByRole('textbox', { name: 'Enter your password' })
    .fill('Orm6+5=11');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(8000);
  await page.locator('img').first().click();
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'My Contact' }).first().click();
  await page.waitForTimeout(8000);
  const contactText = await page.getByText(
    '00KSirilak Kwong linglingkwong linglingsirilak1234567890thaksaporn9667@gmail.'
  );

  if (await contactText.isVisible()) {
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();

    await page.getByRole('button', { name: 'OK' }).nth(1).click();

    await expect(page.getByText('Delete contact succeessful')).toBeVisible();
  }
});

test('Setting noti', async ({ page }) => {
  await page.goto('https://capstone24.sit.kmutt.ac.th/us1/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).fill('ormorm');
  await page.getByRole('textbox', { name: 'Username or Email' }).press('Tab');
  await page
    .getByRole('textbox', { name: 'Enter your password' })
    .fill('Orm6+5=11');
  await page.getByRole('button', { name: 'Sign in now' }).click();
  await page.waitForTimeout(8000);
  await page.locator('img').first().click();
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'My Profile' }).first().click();

  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: 'My Profile' }).first().click();
  await page.locator('.inline-flex > div').first().click();
  await page.locator('div:nth-child(2) > .inline-flex > div').click();
  await page.getByRole('button', { name: 'Save' }).nth(3).click();
  await expect(page.getByText('Update email notification')).toBeVisible();
});
