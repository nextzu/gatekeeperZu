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
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('tester');
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('testing2');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('cacesin20529@gmail.com'); 
  // have to change email 
  await page.getByRole('textbox', { name: 'Contact Name *' }).click();
  await page.getByRole('textbox', { name: 'Contact Name *' }).fill('tester');
  await page.getByRole('spinbutton', { name: 'Phone Number *' }).click();
  await page.getByRole('spinbutton', { name: 'Phone Number *' }).fill('0123456');
  await page.getByLabel('Role *').selectOption('1');
  await page.getByRole('button', { name: 'Submit' }).click();
  try {
    await expect(page.getByText('user has been created')).toBeVisible({timeout:5000});
    console.log("User creation was done successfully.");
  }catch{
    throw new Error("Could not create user.");
  }
});