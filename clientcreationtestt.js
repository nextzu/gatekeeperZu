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
  await page.getByRole('link', { name: 'Clients' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Client Code *' }).click();
  await page.getByRole('textbox', { name: 'Client Code *' }).fill('t0');
  await page.getByRole('textbox', { name: 'Client Name *' }).click();
  await page.getByRole('textbox', { name: 'Client Name *' }).fill('tester');
  await page.getByRole('textbox', { name: 'Primary Contact Email *' }).click();
  await page.getByRole('textbox', { name: 'Primary Contact Email *' }).fill('test@gmail.com');
  await page.getByRole('textbox', { name: 'Primary Contact Phone' }).click();
  await page.getByRole('textbox', { name: 'Primary Contact Phone' }).fill('0123');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Site Type').selectOption('company');
  await page.getByLabel('Currency Code').selectOption('eur');
  await page.getByLabel('VAT Rate').selectOption('zeroRate');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Client has been Created').click();

  // ---------------------
  await context.close();
  await browser.close();
})();