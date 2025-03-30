import { test, expect } from '@playwright/test';
import { HomeTester } from '../../interview-Tekmetric---MCJ/pages/HomeTest'; 
import { ContactUsTester } from '../../interview-Tekmetric---MCJ/pages/ContactUs'; 
import { ProductTester } from '../../interview-Tekmetric---MCJ/pages/Products'; 

test('Create Account', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/');
const Logger = new HomeTester(page);
await page.getByRole('link', { name: ' Signup / Login' }).click();
Logger.Register("Tester", "tester12345@blah.com");
Logger.EnterAccountInfo('Mr.','test1234','6','1','2004',true,true);
Logger.AddressInfo('Tester','Tested','Mock Space','123 fish rd','','United States', 'OH', 'Westlake','44000', '2164445555');
await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page).toHaveTitle(/Account Created/);
});

test('Login to Account', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/');
  const Logger = new HomeTester(page);
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await Logger.login('test123@blah.com','test1234');
  //await page.getByRole('link', { name: ' Logout' });
  await expect(page.getByRole('link', { name: ' Logout' })).toBeVisible();
  
  

});

test('Login with Bad Credentials', async ({ page }) => { 
  await page.goto('https://www.automationexercise.com/');
  const Logger = new HomeTester(page);
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await Logger.login('test123@blah.com','test1i234');
  const errorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
  await expect(errorMessage).toHaveText("Your email or password is incorrect!");


});



test('Logout of Account', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/');
  const Logger = new HomeTester(page);
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await Logger.login('test123@blah.com','test1234');
  //await page.getByRole('link', { name: ' Logout' });
  await page.getByRole('link', { name: ' Logout' }).click();
  await expect(page).toHaveTitle(/Automation Exercise - Signup/);
  




});

test('Create Account with taken email', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/');
const Logger = new HomeTester(page);
await page.getByRole('link', { name: ' Signup / Login' }).click();
Logger.Register("Tester", "test123@blah.com");
const errorMessage = page.locator('p:has-text("Email Address already exist!")');
await expect(errorMessage).toHaveText("Email Address already exist!");

});

test('Send a contactUs message', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/');
const Logger = new ContactUsTester(page);
Logger.contactUs("Tester Tested", "test123@blah.com", "Test Subject", "This is a test Message");
page.once('dialog', dialog => {
  console.log(`Dialog message: ${dialog.message()}`);
  dialog.accept();
  dialog.dismiss().catch(() => {});
});
const success = page.locator("//div[@class='status alert alert-success']");
await expect(success).toHaveText("Success! Your details have been submitted successfully.");
await page.getByRole('link', { name: ' Home' }).click();


});

test('Verify test cases page navigation', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/');
  const Logger = new HomeTester(page);
  await page.getByRole('link', { name: ' Test Cases' }).click();
 
  await expect(page).toHaveTitle(/Automation Practice Website for UI Testing - Test Cases/);
  
  

});


test('Verify all products and first product', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/');
  const Logger = new ProductTester(page);
  await page.getByRole('link', { name: ' Products' }).click();
 
  await expect(page).toHaveTitle(/Automation Exercise - All Products/);
  await Logger.clickViewProductByName("Blue Top");
 

  const blueHeading = page.locator('.product-information h2');
  const category = page.locator('.product-information p').first();
  const availabilityStock = page.locator('.product-information p').nth(1);
  const Condition = page.locator('.product-information p').nth(2);
  const brand = page.locator('.product-information p').nth(3);
  //const price = page.locator('p > span', { hasText: 'Rs. 500' });
  //console.log(price);

// Assertion
  await expect(blueHeading).toHaveText('Blue Top');
  await expect(category).toHaveText(/Category: Women > Tops/);
  //await expect(price).toHaveText(/Rs. 500/);
  await expect(availabilityStock).toHaveText(/Availability/);
  await expect(Condition).toHaveText(/Condition/);
  await expect(brand).toHaveText(/Brand/);

  const priceElement = await page.waitForSelector('text=Rs. 500'); // You can adjust the selector as needed
  
  // Extract the text content of the element
  const priceText = await priceElement.textContent();
  
  // Ensure that the text contains Rs. 500
  expect(priceText).toContain('Rs. 500');



});

/*test('Debug: List all spans on the page', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/product_details/1');

  // Get all span elements' text
  const spans = await page.locator('span').allTextContents();
  
  console.log(spans); // Log all span contents to check if Rs. 500 is detected
});*/

test('search for t-shirt and verify results', async ({ page }) => {
  // Navigate to the products page
  await page.goto('https://www.automationexercise.com/');
  const Logger = new ProductTester(page);
  await page.getByRole('link', { name: ' Products' }).click();
  
  // Locate the search box and type 't-shirt'
  
  await page.getByRole('textbox', { name: 'Search Product' }).fill('t-shirt');
  await page.getByRole('button', { name: '' }).click();

  await page.waitForLoadState('load');
// Wait for the results section to appear
//await page.waitForSelector('.product');  
// Get all product elements
const tshirtcheck = await page.locator('.single-products .productinfo.text-center p');
expect(tshirtcheck).toHaveText(/T-Shirt/);
  //verify that the search query is reflected in the results
  //const pageTitle = await page.title();
  //expect(pageTitle).toContain('Search results for "t-shirt"');

});

test('Verify subscription on Home', async ({ page }) => {
  // Navigate to the products page
  await page.goto('https://www.automationexercise.com/');
  const Logger = new HomeTester(page);
  //Logger.AddSubscription("test123@blah.com");
  await page.getByRole('textbox', { name: 'Your email address' }).click();
  await page.getByRole('textbox', { name: 'Your email address' }).fill("test123@blah.com");
 // Wait for the success message to appear
 const successMessage = await page.locator('.alert-success.alert');

 // Assert that the success message is visible and contains the expected text
 await expect(successMessage).toHaveText('You have been successfully subscribed!');


});

test('Verify subscription on Cart', async ({ page }) => {
  // Navigate to the products page
  await page.goto('https://www.automationexercise.com/view_cart');
  const Logger = new HomeTester(page);
  //Logger.AddSubscription("test123@blah.com");
 // Wait for the success message to appear
 const successMessage = await page.locator('.alert-success.alert');
 await page.getByRole('textbox', { name: 'Your email address' }).click();
 await page.getByRole('textbox', { name: 'Your email address' }).fill("test123@blah.com");
 // Assert that the success message is visible and contains the expected text
 await expect(successMessage).toHaveText('You have been successfully subscribed!');


});



