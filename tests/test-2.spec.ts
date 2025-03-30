import { test, expect } from '@playwright/test';
import { ProductTester } from '../../interview-Tekmetric---MCJ/pages/Products'; 
import { HomeTester } from '../../interview-Tekmetric---MCJ/pages/HomeTest'; 
import { CartTester } from '../../interview-Tekmetric---MCJ/pages/Cart'; 

test('Add product to cart using product name', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/products');
  const Logger = new ProductTester(page);
  const productName = 'Men Tshirt'; // Change this to the desired product name
  const productName2 = 'Blue Top';
  await Logger.clickAddProducts('Men Tshirt');
  
  /*const cartModal = page.locator('#cartModal');
  await expect(page.locator('#cartModal')).toBeVisible();
  await expect(cartModal).toBeVisible();*/

    // Click the "Continue Shopping" button inside the modal
    //const continueShoppingButton = page.locator("button[data-dismiss='modal']");
    //await continueShoppingButton.click();

    // Verify that the modal disappears
    //await expect(cartModal).not.toBeVisible();

  await Logger.clickAddProducts('Blue Top');
  // Click the "View Cart" button inside the modal
  //const viewCartButton = page.locator("a[href='/view_cart']").first();
  //await viewCartButton.click();

  // Verify that we navigated to the cart page
  await page.getByRole('link', { name: ' Products' }).click();
  await page.getByRole('link', { name: ' Cart' }).scrollIntoViewIfNeeded();
  await expect(page).toHaveTitle(/Automation Exercise - All Products/);
  await page.getByRole('link', { name: ' Cart' }).click();
  await page.goto('https://www.automationexercise.com/view_cart')
  await expect(page).toHaveTitle(/Automation Exercise - Checkout/);

  // Verify the product appears in the cart
  const cartProduct = page.locator(`//td[@class='cart_description']//a[text()='${productName}']`);
  await expect(cartProduct).toBeVisible();
  const cartProduct2 = page.locator(`//td[@class='cart_description']//a[text()='${productName2}']`);
  await expect(cartProduct2).toBeVisible();
});

test('Verify total price for all products in cart', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/');
  const Logger = new HomeTester(page);
  const Logger2 = new ProductTester(page);
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await Logger.login('test123@blah.com','test1234');

  await Logger2.clickAddProducts('Men Tshirt');
  await Logger2.clickAddProducts('Blue Top');
  await Logger2.clickAddProducts('Beautiful Peacock Blue Cotton Linen Saree');
  
  await page.goto('https://www.automationexercise.com/view_cart');

  // Locate all product rows in the cart
  const productRows = await page.locator("//tr[contains(@id, 'product-')]").all();

  for (const productRow of productRows) {
      // Get the product name
      const productName = await productRow.locator(".cart_description a").innerText();

      // Get the price per unit and clean it
      const pricePerUnitText = await productRow.locator(".cart_price p").innerText();
      const quantityText = await productRow.locator(".cart_quantity button").innerText();
      const totalPriceText = await productRow.locator(".cart_total p").innerText();

      console.log(`🔍 Raw Values -> ${productName}:`);
      console.log(`  Price Text: ${pricePerUnitText}`);
      console.log(`  Quantity Text: ${quantityText}`);
      console.log(`  Total Price Text: ${totalPriceText}`);

      const pricePerUnit = parseFloat(pricePerUnitText.replace(/[^0-9]/g, ''));
      const quantity = parseInt(quantityText.trim(), 10);
      const displayedTotal = parseFloat(totalPriceText.replace(/[^0-9]/g, ''));

      // Calculate the expected total
      const expectedTotal = pricePerUnit * quantity;

      console.log(`  Processed Values -> ${productName}:`);
      console.log(`  Price: ${pricePerUnit}`);
      console.log(`  Quantity: ${quantity}`);
      console.log(`  Expected Total: ${expectedTotal}`);
      console.log(`  Displayed Total: ${displayedTotal}`);

      // Verify using toBeCloseTo()
      expect(displayedTotal).toBeCloseTo(expectedTotal, 2);
  }
});

test('Verify Product Quantity in cart', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/products');
  const Logger = new ProductTester(page);
  const productName = 'Men Tshirt'; // Change this to the desired product name

  await Logger.clickViewProductByName('Men Tshirt');
  // Locate the quantity input field
  const quantityInput = page.locator('#quantity');

  // Clear any existing value and set quantity to 4
  await quantityInput.fill('4');

  // Click the "Add to Cart" button
  const addToCartButton = page.locator(".btn.btn-default.cart");
  await addToCartButton.click();

  // Wait for the cart modal to appear
  const cartModal = page.locator('#cartModal');
  await expect(cartModal).toBeVisible();

  // Click "View Cart" button inside modal
  const viewCartButton = page.locator("a[href='/view_cart']").nth(1);
  await viewCartButton.click();

  // Verify navigation to cart page
  await expect(page).toHaveURL(/.*\/view_cart/);

  // Verify the quantity is 4 in the cart
  const cartQuantity = page.locator("//td[@class='cart_quantity']//button");
  await expect(cartQuantity).toHaveText('4');


});

test('Verify Register while CheckOut', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/products');
  const Logger = new ProductTester(page);
  const productName = 'Men Tshirt'; // Change this to the desired product name

  await Logger.clickAddProducts('Men Tshirt');
  await Logger.clickAddProducts('Blue Top');
  await Logger.clickAddProducts('Beautiful Peacock Blue Cotton Linen Saree');

  await page.getByRole('link', { name: ' Cart' }).scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: ' Cart' }).click();

  const Checkout = page.locator("a[class='btn btn-default check_out']");
 await Checkout.click();

 // Click "View Cart" button inside modal
 const viewCartButton = page.locator("a[href='/login']").nth(1);
 await viewCartButton.click();

 const Logger2 = new HomeTester(page);
 await Logger2.Register("Tester", "tester1234@blah.com");
 await Logger2.EnterAccountInfo('Mr.','test1234','6','1','2004',true,true);
 await Logger2.AddressInfo('Tester','Tested','Mock Space','123 fish rd','','United States', 'OH', 'Westlake','44000', '2164445555');
await page.getByRole('button', { name: 'Create Account' }).click();

await page.getByRole('link', { name: ' Cart' }).scrollIntoViewIfNeeded();
await page.getByRole('link', { name: ' Cart' }).click();
await Checkout.click();

const Logger3 = new CartTester(page);
await Logger3.verifyAddress(expect,'Tester Tested', 'Mock Space', '123 fish rd', 'Westlake OH 44000', 'United States', '2164445555');
await Logger3.verifyCartItems(expect,'Men Tshirt');
await Logger3.verifyCartItems(expect,'Blue Top');
await Logger3.verifyCartItems(expect,'Beautiful Peacock Blue Cotton Linen Saree');

await Logger3.entercommentandplaceorder("One more for the road");

await Logger3.EnterPayment('Tester Tested','4444 5555 6666 7777', '311', '09', '2028')


await expect(page).toHaveTitle(/Automation Exercise - Order Placed/);
const DeleteButton = page.locator("a[href='/delete_account']");
await DeleteButton.click();
await expect(page).toHaveURL(/.*\/delete_account/);
//This case also covers scenario 23
});

test('Verify Register before CheckOut', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/');
  const Logger2 = new HomeTester(page);
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await Logger2.Register("Tester", "tester1234@blah.com");
  await Logger2.EnterAccountInfo('Mr.','test1234','6','1','2004',true,true);
  await Logger2.AddressInfo('Tester','Tested','Mock Space','123 fish rd','','United States', 'OH', 'Westlake','44000', '2164445555');
 await page.getByRole('button', { name: 'Create Account' }).click();

  await page.goto('https://www.automationexercise.com/products');
  const Logger = new ProductTester(page);
  const productName = 'Men Tshirt'; // Change this to the desired product name

  await Logger.clickAddProducts('Men Tshirt');
  await Logger.clickAddProducts('Blue Top');
  await Logger.clickAddProducts('Beautiful Peacock Blue Cotton Linen Saree');

  await page.getByRole('link', { name: ' Cart' }).scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: ' Cart' }).click();

  const Checkout = page.locator("a[class='btn btn-default check_out']");
 await Checkout.click();



await page.getByRole('link', { name: ' Cart' }).scrollIntoViewIfNeeded();
await page.getByRole('link', { name: ' Cart' }).click();
await Checkout.click();

const Logger3 = new CartTester(page);
await Logger3.verifyAddress(expect,'Tester Tested', 'Mock Space', '123 fish rd', 'Westlake OH 44000', 'United States', '2164445555');
await Logger3.verifyCartItems(expect,'Men Tshirt');
await Logger3.verifyCartItems(expect,'Blue Top');
await Logger3.verifyCartItems(expect,'Beautiful Peacock Blue Cotton Linen Saree');

await Logger3.entercommentandplaceorder("One more for the road");

await Logger3.EnterPayment('Tester Tested','4444 5555 6666 7777', '311', '09', '2028')


await expect(page).toHaveTitle(/Automation Exercise - Order Placed/);
const DeleteButton = page.locator("a[href='/delete_account']");
await DeleteButton.click();
await expect(page).toHaveURL(/.*\/delete_account/);

});

test('Verify Login before CheckOut', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/');
  const Logger2 = new HomeTester(page);
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await Logger2.login('test123@blah.com','test1234');

  await page.goto('https://www.automationexercise.com/products');
  const Logger = new ProductTester(page);
  const productName = 'Men Tshirt'; // Change this to the desired product name

  await Logger.clickAddProducts('Men Tshirt');
  await Logger.clickAddProducts('Blue Top');
  await Logger.clickAddProducts('Beautiful Peacock Blue Cotton Linen Saree');

  await page.getByRole('link', { name: ' Cart' }).scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: ' Cart' }).click();

  const Checkout = page.locator("a[class='btn btn-default check_out']");
 await Checkout.click();



await page.getByRole('link', { name: ' Cart' }).scrollIntoViewIfNeeded();
await page.getByRole('link', { name: ' Cart' }).click();
await Checkout.click();

const Logger3 = new CartTester(page);
await Logger3.verifyAddress(expect,'Tester Tested', 'Mock Space', '123 fish rd', 'Westlake OH 44000', 'United States', '2164445555');
await Logger3.verifyCartItems(expect,'Men Tshirt');
await Logger3.verifyCartItems(expect,'Blue Top');
await Logger3.verifyCartItems(expect,'Beautiful Peacock Blue Cotton Linen Saree');

await Logger3.entercommentandplaceorder("One more for the road");

await Logger3.EnterPayment('Tester Tested','4444 5555 6666 7777', '311', '09', '2028')


await expect(page).toHaveTitle(/Automation Exercise - Order Placed/);


});

test('Verify item delete from cart', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/');
  const Logger = new HomeTester(page);
  const Logger2 = new ProductTester(page);
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await Logger.login('test123@blah.com','test1234');

  await Logger2.clickAddProducts('Men Tshirt');
  await Logger2.clickAddProducts('Blue Top');
  await Logger2.clickAddProducts('Beautiful Peacock Blue Cotton Linen Saree');
  
  await page.goto('https://www.automationexercise.com/view_cart');

   // Verify the product appears in the cart
   const cartProduct = page.locator(`//td[@class='cart_description']//a[text()='Men Tshirt']`);
   await expect(cartProduct).toBeVisible();
   const cartProduct2 = page.locator(`//td[@class='cart_description']//a[text()='Blue Top']`);
   await expect(cartProduct2).toBeVisible();
   const cartProduct3 = page.locator(`//td[@class='cart_description']//a[text()='Beautiful Peacock Blue Cotton Linen Saree']`);
   await expect(cartProduct3).toBeVisible();

  const deletebutton = page.locator("a[class='cart_quantity_delete']").nth(1);
  await deletebutton.click();

    // Verify the product appears in the cart
     
    await expect(cartProduct).toBeVisible();
    await expect(cartProduct2).toBeHidden();
    await expect(cartProduct3).toBeVisible();



});


test('Verify View Category Products', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/');
  const Logger = new HomeTester(page);
  const Logger2 = new ProductTester(page);

Logger2.clickCategoryLink("WOMEN", "DRESS");

const header = page.locator('//h2[contains(text(), "Women - Dress Products")]');
await expect(header).toHaveText("Women - Dress Products");

Logger2.clickCategoryLink("MEN", "TSHIRTS");

const header2 = page.locator('//h2[contains(text(), "Men - Tshirts Products")]');
await expect(header2).toHaveText("Men - Tshirts Products");


});

test('Verify View Brands', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/products');
  const Logger2 = new ProductTester(page);

Logger2.clickBrand("Kookie Kids");

const header = page.locator('//h2[contains(text(), "Brand - Kookie Kids Products")]');
await expect(header).toHaveText("Brand - Kookie Kids Products");


Logger2.clickBrand("Madame");

const header2 = page.locator('//h2[contains(text(), "Brand - Madame Products")]');
await expect(header2).toHaveText("Brand - Madame Products");


});

test('Search Products and Verify Cart After Login', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/products');
  const Logger = new HomeTester(page);
  const Logger2 = new ProductTester(page);
  const Logger3 = new CartTester(page);

  await page.getByRole('textbox', { name: 'Search Product' }).fill('t-shirt');
  await page.getByRole('button', { name: '' }).click();

  const header2 = page.locator('//h2[contains(text(), "Searched Products")]');
  await expect(header2).toHaveText("Searched Products");

  await Logger2.clickAddProducts('Pure Cotton V-Neck T-Shirt');
  await Logger2.clickAddProducts('Green Side Placket Detail T-Shirt');
  await Logger2.clickAddProducts('Premium Polo T-Shirts');
 

  await page.goto('https://www.automationexercise.com/view_cart');


  await Logger3.verifyCartItems(expect,'Pure Cotton V-Neck T-Shirt');
  await Logger3.verifyCartItems(expect,'Green Side Placket Detail T-Shirt');
  await Logger3.verifyCartItems(expect,'Premium Polo T-Shirts');



  await page.goto('https://www.automationexercise.com/login');

  await Logger.login('test123@blah.com','test1234');

  await page.goto('https://www.automationexercise.com/view_cart');


  await Logger3.verifyCartItems(expect,'Pure Cotton V-Neck T-Shirt');
  await Logger3.verifyCartItems(expect,'Green Side Placket Detail T-Shirt');
  await Logger3.verifyCartItems(expect,'Premium Polo T-Shirts');
  

});


test('Verify Product Review', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/products');
  const Logger = new ProductTester(page);
  

  await Logger.clickViewProductByName('Green Side Placket Detail T-Shirt');
  await Logger.productReview("Tester", "bananas@dk.com", "This certainly is a review");

  const header = page.locator('//div[@class="alert-success alert"]').first();
  await expect(header).toHaveText("Thank you for your review.");

});


test('Verify Add Recommended Item to Cart', async ({ page }) => {

  await page.goto('https://www.automationexercise.com/');
  const Logger = new CartTester(page);
  
  // Scroll to the "Recommended Products" section
  const recommendedSection = page.locator('h2:has-text("recommended items")');
  await recommendedSection.scrollIntoViewIfNeeded();
  await expect(recommendedSection).toBeVisible();

  // Locate the first product in the Recommended section
  const firstProduct = page.locator('.recommended_items .productinfo').first();

  // Ensure product is in view
  await firstProduct.scrollIntoViewIfNeeded();

  // Hover over the product to trigger overlay (if needed)
  const productContainer = firstProduct.locator('xpath=ancestor::div[contains(@class, "product-image-wrapper")]');
  

  // Click "Add to Cart" button inside the same container
  const addToCartButton = productContainer.locator('a.add-to-cart').first();
  await addToCartButton.click();

  // Verify that the cart modal appears
  const cartModal = page.locator('#cartModal');
  await expect(cartModal).toBeVisible();

  const viewCartButton = page.locator("a[href='/view_cart']").nth(1);
    await viewCartButton.click();

    await Logger.verifyCartItems(expect,'Blue Top');

});

test('Verify Scroll Up using Arrow button and Scroll Down functionality', async ({ page }) => {
  // Navigate to the test cases page
  await page.goto('https://www.automationexercise.com/test_cases');

  // Scroll down to the bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait for an element at the bottom (e.g., footer) to confirm scroll-down
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();

  // Scroll back up using the "Arrow Up" button
  const scrollUpButton = page.locator('#scrollUp');
  await scrollUpButton.click();

  // Wait for the top of the page (e.g., the logo or header) to become visible
  const headerLogo = page.locator('.logo img'); 
  await expect(headerLogo).toBeVisible();

  
});

test('Verify Scroll Up without Arrow button and Scroll Down functionality', async ({ page }) => {
  // Navigate to the test cases page
  await page.goto('https://www.automationexercise.com/test_cases');

  // Scroll down to the bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait for an element at the bottom (e.g., footer) to confirm scroll-down
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();

  // Scroll back up using JavaScript instead of clicking the "Arrow Up" button
  await page.evaluate(() => window.scrollTo(0, 0));

  // Wait for the top of the page (e.g., the header logo) to become visible
  const headerLogo = page.locator('.logo img'); 
  await expect(headerLogo).toBeVisible();


});