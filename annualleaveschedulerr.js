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
  await page.getByRole('link', { name: 'Scheduler' }).click();
  await page.locator('div').filter({ hasText: /^Select Client\(s\)$/ }).nth(2).click();
  await page.getByRole('option', { name: 'Ahmed UKFS Client' }).click();
  await page.locator('div').filter({ hasText: /^Select Engineer\(s\)$/ }).nth(2).click();
  await page.getByRole('option', { name: 'tester tester' }).click();
  await page.locator('div').filter({ hasText: /^Select Event Type\(s\)$/ }).nth(2).click();
  await page.getByRole('option', { name: 'Annual Leave' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Title *' }).click();
  await page.getByRole('textbox', { name: 'Title *' }).fill('test');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('test');
  await page.locator('div').filter({ hasText: /^Select User\(s\)$/ }).nth(2).click();
  await page.getByRole('option', { name: 'gfdsgds gfdsgds' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Event has been Created').click();

  // ---------------------
  await context.close();
  await browser.close();
})();