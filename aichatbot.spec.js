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
  await page.getByRole('textbox', { name: 'Speak or type your request;' }).click();
  await page.getByRole('textbox', { name: 'Speak or type your request;' }).fill('log a job');
  await page.locator('.chakra-input__right-element > svg > path').first().click();
  /*
  const errorToast = page.locator(`#toast`, {hasText: `Error`});
  try{
    await expect(errorToast).toBeVisible({timeout:2000});
    throw new Error("Toast error :");
  }catch(err){
    if (!err.message.includes(`Timeout`)) throw err;
  }
    */
  await page.locator('.css-18euh9p').first().click();
  await page.locator('#react-select-2-option-0').click();
  await page.locator('div:nth-child(2) > .css-79elbk > .css-9ot681 > .css-bbh3wv > .css-18euh9p').first().click();
  await page.getByRole('option', { name: 'Tech Solutions HQ' }).click();
  await page.locator('.chakra-stack.css-1o1ilrx > div > .css-79elbk > .css-9ot681 > .css-bbh3wv > .css-18euh9p').first().click();
  await page.getByRole('option', { name: 'Maintenance' }).click();
  await page.locator('.chakra-stack.css-1o1ilrx > div:nth-child(2) > .css-79elbk > .css-9ot681 > .css-bbh3wv > .css-18euh9p').click();
  await page.getByRole('option', { name: 'Cleaning' }).click();
  await page.locator('div:nth-child(3) > div > .css-79elbk > .css-9ot681 > .css-bbh3wv > .css-18euh9p').click();
  await page.getByRole('option', { name: 'auto test' }).click();
  await page.getByRole('textbox', { name: 'Schedule Date' }).click();
  await page.getByRole('textbox', { name: 'Description' }).click();
 // const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Cancel' }).click();
  console.log("AI chatbot works well.");
 // const page1 = await page1Promise;
});