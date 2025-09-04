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
  await page.getByRole('link', { name: 'Jobs' }).click();
  await page.getByRole('button', { name: 'Assigned' }).click();
  await page.locator('td:nth-child(2)').first().click();
  await page.getByRole('button', { name: 'Edit Job' }).click();
  await page.getByRole('textbox', { name: 'Select Date' }).click();
  await page.getByRole('option', { name: 'Choose Friday, August 22nd,' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();
  try {
    await expect(page.getByText('Job has been updated')).toBeVisible({timeout:5000});
    console.log("Job has been rescheduled successfully.");
  }catch{
    throw new Error("Could not reschedule job.");
  }
});