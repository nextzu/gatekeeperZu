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
  await page.getByText('New Job').click();
  await page.locator('.css-18euh9p').first().click();
  await page.locator('#react-select-2-option-0').click();
  await page.locator('.joyride-job-type-dropdown > .css-lw13nc > .css-1btx5z2 > .css-18euh9p').click();
  await page.getByRole('option', { name: 'Installation2/Freezer' }).click();
  await page.locator('.joyride-contact-dropdown > .css-lw13nc > .css-1btx5z2 > .css-18euh9p').click();
  await page.getByRole('option', { name: 'ferf || er@re.cot ||' }).click();
  await page.getByText('+ Add Issue(s) Here').click();
  await page.getByRole('textbox', { name: 'Issue *' }).click();
  await page.getByRole('textbox', { name: 'Issue *' }).fill('55 error');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Log' }).click();
  try {
    await expect(page.getByText(/Job No\. \d+ \/ Open/)).toBeVisible({timeout:5000});
    console.log("Created job appeared successfully.");
  }catch{
    throw new Error("Assigned job not found on the page.");
  }
  await page.getByRole('button', { name: 'Assign' }).click();
  await page.locator('.css-18euh9p').first().click();
  await page.getByRole('option', { name: 'tester tester' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  try {
    await expect(page.getByText(/Job No\. \d+ \/ Assigned/)).toBeVisible({timeout:5000});
    console.log("Assigned job appeared successfully.");
  }catch{
    throw new Error("Assigned job not found on the page.");
  }
});
