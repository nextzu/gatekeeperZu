const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://ukfieldservice.com/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('ahmedukfs@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Jobs' }).click();
  await page.getByRole('button', { name: 'Assigned' }).click();
  await page.locator('td:nth-child(2)').first().click();
  await page.getByRole('button', { name: 'Edit Job' }).click();
  await page.getByRole('textbox', { name: 'Select Date' }).click();
  await page.getByRole('option', { name: 'Choose Friday, August 22nd,' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByText('Job has been updated').click();

  // ---------------------
  await context.close();
  await browser.close();
})();