export class CartTester {
    constructor(page) {
        this.page = page;

        // Common locators stored in constructor
        this.cartLink = page.getByRole('link', { name: ' Cart' });
        this.proceedCheckout = page.getByText('Proceed To Checkout');
        this.checkoutmessagebox = page.locator('textarea[name="message"]');
        this.placeOrder = page.getByRole('link', { name: 'Place Order' });
        this.nameOnCard = page.locator('input[name="name_on_card"]');
        this.cardNumber = page.locator('input[name="card_number"]');
        this.cardCVV = page.getByRole('textbox', { name: 'ex.' });
        this.cardMonth = page.getByRole('textbox', { name: 'MM' });
        this.cardYear = page.getByRole('textbox', { name: 'YYYY' });
        this.confirmPayment = page.getByRole('button', { name: 'Pay and Confirm Order' });
        this.downloadInvoice = page.getByRole('link', { name: 'Download Invoice' });
    }

    async verifyAddress(expect, name, company, street, citystatezip, country, phone) {
        const billingAddress = this.page.locator('#address_delivery');
        const shippingAddress = this.page.locator('#address_invoice');

        await expect(billingAddress).toBeVisible();
        await expect(shippingAddress).toBeVisible();

        await expect(billingAddress).toContainText(name);
        await expect(billingAddress).toContainText(company);
        await expect(billingAddress).toContainText(street);
        await expect(billingAddress).toContainText(citystatezip);
        await expect(billingAddress).toContainText(country);
        await expect(billingAddress).toContainText(phone);

        await expect(shippingAddress).toContainText(name);
        await expect(shippingAddress).toContainText(company);
        await expect(shippingAddress).toContainText(street);
        await expect(shippingAddress).toContainText(citystatezip);
        await expect(shippingAddress).toContainText(country);
        await expect(shippingAddress).toContainText(phone);
    }

    async verifyCartItems(expect, productName) {
       /* // Verify products under "Review Your Order"
        const cartItems = this.page.locator('.cart_description');
        await expect(cartItems).toBeVisible();

        // Example: Verify a specific product is in the cart
        const productInReview = this.page.locator(`//td[@class='cart_description']//a[text()='${productName}']`);
        await expect(productInReview).toBeVisible();

        */
        
            // Verify products under "Review Your Order"
            const cartItems = this.page.locator('.cart_description');
            
            // Ensure there are cart items
            //await expect(cartItems).toBeVisible();
        
            // Get all the product names and iterate through to find the correct one
            const productNames = cartItems.locator('a'); // Assuming each product name is wrapped in <a> tags
            
            const productCount = await productNames.count(); // Get how many product names exist in the cart
        
            let productFound = false;
        
            for (let i = 0; i < productCount; i++) {
                const product = productNames.nth(i); // Get the nth product
                const productText = await product.textContent(); // Get the product name text
                
                // If the product matches, assert its visibility and break the loop
                if (productText.trim() === productName) {
                    await expect(product).toBeVisible();
                    productFound = true;
                    break;
                }
            }

    }

    async entercommentandplaceorder(comment) {
        await this.checkoutmessagebox.fill(comment);
        await this.placeOrder.click();



    }

    async EnterPayment(name, cardnumber, cvc, expirationMonth, expirationYear) {
        await this.nameOnCard.fill(name);
        await this.cardNumber.fill(cardnumber);
        await this.cardCVV.fill(cvc);
        await this.cardMonth.fill(expirationMonth);
        await this.cardYear.fill(expirationYear);
        await this.confirmPayment.click();



    }
}