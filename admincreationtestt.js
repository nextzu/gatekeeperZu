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
  await page.getByRole('link', { name: 'Global Settings' }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('tester');
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('testing');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('cacesin2052@gmail.com');
  await page.getByRole('textbox', { name: 'Contact Name *' }).click();
  await page.getByRole('textbox', { name: 'Contact Name *' }).fill('tester');
  await page.getByRole('spinbutton', { name: 'Phone Number *' }).click();
  await page.getByRole('spinbutton', { name: 'Phone Number *' }).fill('0123456');
  await page.getByLabel('Role *').selectOption('1');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('#toast-1').click();
  await page.getByText('user has been created').click();
  await page.locator('#toast-1').click();
  await page.getByText('Success', { exact: true }).click();

  // ---------------------
  await context.close();
  await browser.close();
})();