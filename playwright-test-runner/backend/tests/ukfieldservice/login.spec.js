import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ukfieldservice.com/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('ahmedukfs@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1234');
  await page.getByRole('button', { name: 'Sign in' }).click();
  //await expect(page).toHaveURL(/.*dashboard/);
  try{
    await expect(page).toHaveURL(/.*dashboard/, {timeout:5000});
    console.log("Logged in successfully.");
  }catch(err){
    throw new Error(`Wrong login(mail or password)- dashboard not reached`);
  }
  //await page.screenshot({path: `testlogin.png`});
});