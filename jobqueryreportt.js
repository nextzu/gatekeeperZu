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
  await page.getByRole('button', { name: 'Reports' }).click();
  await page.getByRole('link', { name: 'Job Query Report' }).click();
  await page.getByRole('group').filter({ hasText: 'Date To' }).getByRole('img').click();
  await page.getByRole('option', { name: 'Choose Friday, August 22nd,' }).click();
  await page.getByLabel('Job Type').selectOption('248');
  await page.getByRole('button', { name: 'Search' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('cell', { name: '347' }).click();
  const page1 = await page1Promise;

  // ---------------------
  await context.close();
  await browser.close();
})();