import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ukfieldservice.com/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('ahmedukfs@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  try{
    await expect(page).toHaveURL(/.*dashboard/, {timeout:5000});
    console.log("Logged in successfully.");
  }catch(err){
    throw new Error(`Wrong login(mail or password)- dashboard not reached`);
  }
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
  try {
    await expect(page.getByText('Client has been Created')).toBeVisible({timeout:5000});
    console.log("User creation was done successfully.");
  }catch{
    throw new Error("Could not create user.");
  }
});
