import {setTimeout} from "node:timers/promises";

export class ProductTester {


    constructor (page) {

        this.page = page;
    
        // Common locators stored in constructor
        this.productsLink = page.getByRole('link', { name: ' Products' });
        this.searchBox = page.getByRole('textbox', { name: 'Search Product' });
        this.searchButton = page.getByRole('button', { name: '' });
        this.ViewProductButton = page.getByRole('link', { name: ' View Product' });
        this.reviewName = page.getByRole('textbox', { name: 'Your Name' });
        this.reviewEmail = page.getByRole('textbox', { name: 'Email Address', exact: true });
        this.reviewBox = page.getByRole('textbox', { name: 'Add Review Here!' });
        this.submitreview = page.getByRole('button', { name: 'Submit' });
        this.quantityAdder = page.locator('#quantity');
        this.addCartButton = page.getByRole('button', { name: ' Add to cart' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });

        //space
        this.womensCategory = page.locator(`//a[@href = '#Women']`);
        this.mensCategory = page.locator(`//a[@href = '#Men']`);
        this.kidsCategory =  page.locator(`//a[@href = '#Kids']`);

        this.viewCartButton = page.getByRole('link', { name: 'View Cart' });

        
        
        



    }

  async clickCategoryLink(category, subcategory) {
    var categoryNum = 0; 

    if (category === "MEN"){
        await this.mensCategory.click();
        if (subcategory === "TSHIRTS"){
            categoryNum = 3;
        }else if (subcategory === "JEANS"){
            categoryNum = 6;
        }

    }else if (category === "WOMEN"){
        await this.womensCategory.click();
        if (subcategory === "DRESS"){
            categoryNum = 1;
    
        } else if (subcategory === "TOPS"){
            categoryNum = 2;
        }
        else if (subcategory === "SAREE"){
            categoryNum = 7;
        }

    }else if (category === "KIDS"){
        await this.kidsCategory.click();
        if (subcategory === "DRESS"){
            categoryNum = 4;
        }else if (subcategory === "TOPS & SHIRTS"){
            categoryNum = 5;
        }
    }
    
       
        //[contains(text(), '${category}')]
        
        const categoryLink = this.page.locator(`//a[@href='/category_products/${categoryNum}']`);
        await categoryLink.click();
        console.log(`Clicked on ${category} > ${subcategory}`);
    }

    
    async getAllBrands() {
        const brandElements = await this.page.$$("xpath=//div[@class='brands-name']//a");
        const brands = [];
        
        for (const element of brandElements) {
            const brandName = await element.innerText();
            brands.push(brandName.trim());
        }

        console.log("Available Brands:", brands);
        return brands;
    }

    async clickBrand(brandName) {
        //const brandXpath = `//div[@class='brands-name']//a[contains(text(), '${brandName}')]`;
        const brandXpath = this.page.locator(`//a[contains(@href, '/brand_products/')][contains(., '${brandName}')]`);
        await brandXpath.scrollIntoViewIfNeeded();
        await brandXpath.click();
        console.log(`Clicked on brand: ${brandName}`);
    }

    async getAllProducts() {
        // Locate all the product elements
        const productElements = this.page.locator('.single-products');
        const productCount = await productElements.count();  // Get the number of product elements
        const products = [];
    
        for (let i = 0; i < productCount; i++) {
            // Get the product name (could also extract other details like price, image, etc.)
            const productName = await productElements.nth(i).locator('h2').textContent();
            if (productName) {
                products.push(productName.trim());
            }
        }
    
        console.log("Available Products:", products);
        return products;
    }

    async clickAddProducts(productName) {
        // Re-locate product card to avoid stale element issues
         const productCard = this.page.locator(`.productinfo p:text("${productName}")`).first();
    
        // Ensure the product card is visible
        //await productCard.waitFor({ state: 'visible' });
    
        // Scroll the product into view
        await productCard.scrollIntoViewIfNeeded();
    
        // Get the parent container of the product and the overlay
        const productContainer = productCard.locator('xpath=ancestor::div[contains(@class, "product-image-wrapper")]');
        const overlay = productContainer.locator('.product-overlay');
    
        // Wait for the overlay to be attached and move the mouse
        await overlay.waitFor({ state: 'attached' });
    
        const box = await overlay.boundingBox();
        if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        }
    
        // Locate and click the "Add to Cart" button
        const addToCartButton = this.page.locator(
            `//p[text()='${productName}']/ancestor::div[contains(@class, 'product-image-wrapper')]//a[contains(@class, 'add-to-cart')]`
        ).first();
    
        await addToCartButton.waitFor({ state: 'visible' });
        await addToCartButton.click();
    
        // Verify the cart modal appears
        const cartModal = this.page.locator('#cartModal');
        //await expect(cartModal).toBeVisible();
    
        // Click the "Continue Shopping" button to close the modal
        const continueShoppingButton = this.page.locator("button[data-dismiss='modal']");
        await continueShoppingButton.click();
    
        // Wait for the modal to be closed and the DOM to stabilize
        //await cartModal.waitFor({ state: 'detached' });
        
        // Re-locate the product card after the modal closes
        //const updatedProductCard = this.page.locator(`.productinfo p:text("${productName}")`).first();
        //await updatedProductCard.scrollIntoViewIfNeeded(); 
    
        // ensure the page has loaded and is ready for the next action
        await this.page.waitForLoadState('domcontentloaded');
    }

    
    

    
    // You can then use this in your 'clickViewProductByName' method like this:
    async clickViewProductByName(productName) {
         // Re-locate product card to avoid stale element issues
         const productCard = this.page.locator(`.productinfo p:text("${productName}")`).first();
    
         // Ensure the product card is visible
         //await productCard.waitFor({ state: 'visible' });
     
         // Scroll the product into view
         await productCard.scrollIntoViewIfNeeded();
     
         // Get the parent container of the product and the overlay
         const productContainer = productCard.locator('xpath=ancestor::div[contains(@class, "product-image-wrapper")]');
         const overlay = productContainer.locator('.product-overlay');
     
         // Wait for the overlay to be attached and move the mouse
         await overlay.waitFor({ state: 'attached' });
     
         const box = await overlay.boundingBox();
         if (box) {
             await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
         }
     
         // Locate and click the "Add to Cart" button
         const addToCartButton = this.page.locator(
             `//p[text()='${productName}']/ancestor::div[contains(@class, 'product-image-wrapper')]//a[contains(text(), 'View Product')]`
         ).first();
     
         await addToCartButton.waitFor({ state: 'visible' });
        await addToCartButton.click();
         
         await this.page.waitForLoadState('domcontentloaded');
            
    }
    

        // Clicks "Add to Cart" for a product by product name
        async clickAddToCartByName(productName) {
            const productXpath = `//div[@class='features_items']//div[@class='productinfo text-center']/p[contains(text(), '${productName}')]/ancestor::div[@class='product-image-wrapper']//a[contains(text(), 'Add to cart')]`;
            await this.page.click(`xpath=${productXpath}`);
            console.log(`Clicked "Add to Cart" for: ${productName}`);
        }

        async productReview(username, useremail, userreview) {
            //input[@id='name']

            const name = this.page.locator(`//input[@id='name']`);
            const email = this.page.locator(`//input[@id='email']`);
            const review = this.page.locator(`//textarea[@id='review']`);

            await review.scrollIntoViewIfNeeded();

            await name.fill(username);
            await email.fill(useremail);
            await review.fill(userreview);

            const submit = this.page.locator(`//button[@id='button-review']`);

            await submit.scrollIntoViewIfNeeded();
            await submit.click();

        }


  



}