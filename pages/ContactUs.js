export class ContactUsTester {


    constructor (page) {

        
        this.page = page;
        this.contactUsLink = page.getByRole('link', { name: 'Contact Us' });
        this.contactName = page.getByRole('textbox', { name: 'Name' });
        this.contactEmail = page.getByRole('textbox', { name: 'Email', exact: true });
        this.subjectLine = page.getByRole('textbox', { name: 'Subject' });
        this.messageField = page.locator('textarea[name="message"]');
        this.submitButton = page.getByRole('button', { name: 'Submit' });



    
        // Common locators stored in constructor
        //page.getByRole('textbox', { name: 'Name' }).press('Tab');
        //await page.getByRole('textbox', { name: 'Email', exact: true })
        //page.getByRole('textbox', { name: 'Subject' })
        // await page.getByRole('textbox', { name: 'Your Message Here' });

        //page.getByRole('button', { name: 'Submit' });

    }

    async contactUs(Name, Email, Subject, Message){

        
        await this.contactUsLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.contactName.fill(Name);
        await this.contactEmail.fill(Email);
        await this.subjectLine.fill(Subject);
        await this.messageField.fill(Message);
        
        await this.submitButton.waitFor({ state: 'visible' });
        await this.submitButton.click();
        
    }




}