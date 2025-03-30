export class HomeTester {


    constructor (page) {
        
            this.page = page;
    
            // Common locators stored in constructor
            this.signUpLink = page.getByRole('link', { name: ' Signup / Login' });
            this.nameInput = page.getByRole('textbox', { name: 'Name' });
            this.emailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
            this.signUpButton = page.getByRole('button', { name: 'Signup' });
    
            this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    
            this.mrRadio = page.getByRole('radio', { name: 'Mr.' });
            this.mrsRadio = page.getByRole('radio', { name: 'Mrs.' });
    
            this.daysDropdown = page.locator('#days');
            this.monthsDropdown = page.locator('#months');
            this.yearsDropdown = page.locator('#years');
    
            this.newsletterCheckbox = page.getByText('Sign up for our newsletter!');
            this.offersCheckbox = page.getByRole('checkbox', { name: 'Receive special offers from' });
    
            this.firstNameInput = page.getByRole('textbox', { name: 'First name *' });
            this.lastNameInput = page.getByRole('textbox', { name: 'Last name *' });
            this.companyInput = page.getByRole('textbox', { name: 'Company', exact: true });
            this.addressInput = page.getByRole('textbox', { name: 'Address * (Street address, P.' });
            this.address2Input = page.getByRole('textbox', { name: 'Address 2' });
            this.countryDropdown = page.getByLabel('Country *');
            this.stateInput = page.getByRole('textbox', { name: 'State *' });
            this.cityInput = page.getByRole('textbox', { name: 'City * Zipcode *' });
            this.zipcodeInput = page.locator('#zipcode');
            this.mobileInput = page.getByRole('textbox', { name: 'Mobile Number *' });

            this.emailLogin = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
            this.password = page.getByRole('textbox', { name: 'Password' });

            this.LoginButton = page.getByRole('button', { name: 'Login' });
        }
    
    

    async login(username, passcode){

        await this.emailLogin.fill(username);
        await this.password.fill(passcode);
        await this.LoginButton.click();

    }

    async Register(name, email) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.signUpButton.click();
    }

    async EnterAccountInfo(title, password, birthday, birthmonth, birthyear, newsletter, offers) {
        if (title === "Mr.") {
            await this.mrRadio.check();
        } else if (title === "Mrs.") {
            await this.mrsRadio.check();
        }
    
        await this.passwordInput.fill(password);
        await this.daysDropdown.selectOption(birthday);
        await this.monthsDropdown.selectOption(birthmonth);
        await this.yearsDropdown.selectOption(birthyear);
    
        if (newsletter) {
            await this.newsletterCheckbox.click();
        }
        if (offers) {
            await this.offersCheckbox.check();
        }
    }

async AddressInfo(firstname,lastname,company,address,address2,country,state,city,zipcode,mobilenumber){


  await this.page.getByRole('textbox', { name: 'First name *' }).fill(firstname);
  await this.page.getByRole('textbox', { name: 'Last name *' }).fill(lastname);
  await this.page.getByRole('textbox', { name: 'Company', exact: true }).fill(company);
  await this.page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(address);
  if (address2 != ""){
    await this.page.getByRole('textbox', { name: 'Address 2' }).fill(address2);

  }
  await this.page.getByLabel('Country *').selectOption(country);
  await this.page.getByRole('textbox', { name: 'State *' }).fill(state);
  await this.page.getByRole('textbox', { name: 'City * Zipcode *' }).fill(city);
  await this.page.locator('#zipcode').fill(zipcode);
  await this.page.getByRole('textbox', { name: 'Mobile Number *' }).fill(mobilenumber);

    }


    async AddSubscription(email){
        //const subscriptionTextbox = await this.page.locator('.subscribe-form input');
        //subscriptionTextbox.scrollIntoViewIfNeeded();
        console.log(email);
        //await subscriptionTextbox.click();
        //await subscriptionTextbox.fill(email);

        ////*[@id="susbscribe_email"]
        //await this.page.getByRole('textbox', { name: 'Your email address' }).click();
        //await this.page.getByRole('textbox', { name: 'Your email address' }).fill(email);

        const field = await this.page.locator('xpath=//input[@id="susbscribe_email"]');
        await field.click();
        await field.fill(email);
        //await this.page.waitForSelector('#susbscribe_email', { state: 'visible' });
        //await this.page.fill('#susbscribe_email', email);
        //await this.page.getByRole('textbox', { name: 'Your email address' }).fill(email);
        await this.page.getByRole('button', { name: '' }).click();


          }
}