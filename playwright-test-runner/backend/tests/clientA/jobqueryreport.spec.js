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
  await page.getByRole('button', { name: 'Reports' }).click();
  await page.getByRole('link', { name: 'Job Query Report' }).click();
  await page.getByRole('group').filter({ hasText: 'Date To' }).getByRole('img').click();
  await page.getByRole('option', { name: 'Choose Friday, August 22nd,' }).click();
  await page.getByLabel('Job Type').selectOption('248');
  await page.getByRole('button', { name: 'Search' }).click();
  //const page1Promise = page.waitForEvent('popup');
  try {
    await page.getByRole('cell', { name: '347' }).click();
    console.log("Report creation was done successfully.");
  }catch{
    throw new Error("Could not create report.");
  }
});