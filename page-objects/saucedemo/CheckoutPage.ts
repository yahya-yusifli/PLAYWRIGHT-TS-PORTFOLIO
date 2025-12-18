import { Page, Locator } from '@playwright/test';
import { BasePage } from '../shared/BasePage';

export class CheckoutPage extends BasePage{
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly backHomeButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.locator('#first-name');
        this.lastNameInput = page.locator('#last-name');
        this.postalCodeInput = page.locator('#postal-code');
        this.continueButton = page.locator('#continue');
        this.finishButton = page.locator('#finish');
        this.completeHeader = page.locator('.complete-header');
        this.completeText = page.locator('.complete-text');
        this.backHomeButton = page.locator('#back-to-products');
        this.errorMessage = page.locator('[data-test="error"]');
    }
    
    async goto() {
        await super.goto('/checkout-step-one.html');
    }

    async fillShippingInformation(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async clickFinish() {
        await this.finishButton.click();
    }

    async getCompleteMessage(): Promise<string> {
        return await this.completeHeader.textContent() || '';
    }

    async isOrderComplete(): Promise<boolean> {
        return await this.completeHeader.isVisible();
    }

    async clickBackHome() {
        await this.backHomeButton.click();
    }

    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() || '';
    }

}