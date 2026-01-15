import { test, expect } from '../../fixtures/auth-fixtures';
import { ProductsPage } from '../../../page-objects/saucedemo/ProductsPage';
import { CartPage } from '../../../page-objects/saucedemo/CartPage';
import { CheckoutPage } from '../../../page-objects/saucedemo/CheckoutPage';


test.describe('SauceDemo Checkout Tests', () => {
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page,loggedInAsStandardUser }) => {
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await productsPage.addProductToCartByName('Sauce Labs Backpack');
        await productsPage.clickShoppingCart();
        await cartPage.clickCheckout();
    });

    // Valid Checkout Information
    test.describe('Valid Checkout Information', () => {

        test('should complete with valid data', async ({ page }) => {
            await checkoutPage.fillShippingInformation('John', 'Doe', '12345');
            await checkoutPage.clickContinue();
            await expect(page).toHaveURL(/.*checkout-step-two.html/);
        });

        test('should fill fields separately', async ({ page }) => {
            await checkoutPage.firstNameInput.fill('John');
            await checkoutPage.lastNameInput.fill('Doe');
            await checkoutPage.postalCodeInput.fill('12345');
            await checkoutPage.clickContinue();
            await expect(page).toHaveURL(/.*checkout-step-two.html/);
        });

        test('should accept special characters in names', async ({ page }) => {
            await checkoutPage.fillShippingInformation('John-Paul', "O'Connor", '12345');
            await checkoutPage.clickContinue();
            await expect(page).toHaveURL(/.*checkout-step-two.html/);
        });

        test('should accept various postal code formats', async ({ page }) => {
            await checkoutPage.fillShippingInformation('John', 'Doe', 'ABC123');
            await checkoutPage.clickContinue();
            await expect(page).toHaveURL(/.*checkout-step-two.html/);
        });
    });

    // Form Field Validation
    test.describe('Form Field Validation', () => {

        test('should show error for missing first name', async () => {
            await checkoutPage.fillShippingInformation('', 'Doe', '12345');
            await checkoutPage.clickContinue();
            await expect(checkoutPage.errorMessage).toBeVisible();
            const error = await checkoutPage.getErrorMessage();
            expect(error).toContain('First Name is required');
        });

        test('should show error for missing last name', async () => {
            await checkoutPage.fillShippingInformation('John', '', '12345');
            await checkoutPage.clickContinue();
            await expect(checkoutPage.errorMessage).toBeVisible();
            const error = await checkoutPage.getErrorMessage();
            expect(error).toContain('Last Name is required');
        });

        test('should show error for missing postal code', async () => {
            await checkoutPage.fillShippingInformation('John', 'Doe', '');
            await checkoutPage.clickContinue();
            await expect(checkoutPage.errorMessage).toBeVisible();
            const error = await checkoutPage.getErrorMessage();
            expect(error).toContain('Postal Code is required');
        });

        test('should show error for all fields empty', async () => {
            await checkoutPage.clickContinue();
            await expect(checkoutPage.errorMessage).toBeVisible();
            await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
        });

        test('should dismiss error message', async ({ page }) => {
            await checkoutPage.clickContinue();
            await expect(checkoutPage.errorMessage).toBeVisible();
            await page.locator('.error-button').click();
            await expect(checkoutPage.errorMessage).not.toBeVisible();
        });
    });

    // Checkout Navigation
    test.describe('Checkout Navigation', () => {

        test('should cancel from checkout', async ({ page }) => {
            await page.locator('#cancel').click();
            await expect(page).toHaveURL(/.*cart.html/);
        });

        test('should go back to cart', async ({ page }) => {
            await page.locator('#cancel').click();
            await expect(page).toHaveURL(/.*cart.html/);
            await expect(cartPage.cartItems).toHaveCount(1);
        });

        test('should persist form field data', async () => {
            await checkoutPage.firstNameInput.fill('John');
            await checkoutPage.lastNameInput.fill('Doe');
            const firstName = await checkoutPage.firstNameInput.inputValue();
            const lastName = await checkoutPage.lastNameInput.inputValue();
            expect(firstName).toBe('John');
            expect(lastName).toBe('Doe');
        });
    });

    // Checkout Overview
    test.describe('Checkout Overview', () => {
        test.beforeEach(async () => {
            await checkoutPage.fillShippingInformation('John', 'Doe', '12345');
            await checkoutPage.clickContinue();
        });


        test('should display item names', async ({ page }) => {
            const itemName = await page.locator('.inventory_item_name').textContent();
            expect(itemName).toBe('Sauce Labs Backpack');
        });


        test('should display correct item prices', async ({ page }) => {
            const price = await page.locator('.inventory_item_price').textContent();
            expect(price).toContain('$');
        });


        test('should calculate subtotal correctly', async ({ page }) => {
            const subtotal = await page.locator('.summary_subtotal_label').textContent();
            expect(subtotal).toContain('$');
        });


        test('should calculate tax correctly', async ({ page }) => {
            const tax = await page.locator('.summary_tax_label').textContent();
            expect(tax).toContain('$');
        });


        test('should calculate total correctly', async ({ page }) => {
            const total = await page.locator('.summary_total_label').textContent();
            expect(total).toContain('$');
        });


        test('should display payment information', async ({ page }) => {
            const paymentInfo = await page.locator('.summary_value_label').first().textContent();
            expect(paymentInfo).toBeTruthy();
        });
    });


    // Order Summary
    test.describe('Order Summary', () => {
        test.beforeEach(async () => {
            await checkoutPage.fillShippingInformation('John', 'Doe', '12345');
            await checkoutPage.clickContinue();
        });


        test('should show complete order summary', async ({ page }) => {
            await expect(page.locator('.summary_info')).toBeVisible();
            await expect(page.locator('.cart_list')).toBeVisible();
        });


        test('should display shipping information', async ({ page }) => {
            const shippingInfo = await page.locator('.summary_value_label').nth(1).textContent();
            expect(shippingInfo).toBeTruthy();
        });


        test('should verify total matches subtotal plus tax', async ({ page }) => {
            const subtotalText = await page.locator('.summary_subtotal_label').textContent() || '';
            const taxText = await page.locator('.summary_tax_label').textContent() || '';
            const totalText = await page.locator('.summary_total_label').textContent() || '';

            const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
            const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
            const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));

            expect(total).toBeCloseTo(subtotal + tax, 2);
        });


        test('should verify item count', async ({ page }) => {
            const items = await page.locator('.cart_item').all();
            expect(items.length).toBe(1);
        });
    });


    // Complete Order
    test.describe('Complete Order', () => {
        test.beforeEach(async () => {
            await checkoutPage.fillShippingInformation('John', 'Doe', '12345');
            await checkoutPage.clickContinue();
        });


        test('should have finish button enabled', async () => {
            await expect(checkoutPage.finishButton).toBeEnabled();
        });


        test('should complete order successfully', async ({ page }) => {
            await checkoutPage.clickFinish();
            await expect(page).toHaveURL(/.*checkout-complete.html/);
        });


        test('should show confirmation message', async () => {
            await checkoutPage.clickFinish();
            await expect(checkoutPage.completeHeader).toBeVisible();
            const message = await checkoutPage.getCompleteMessage();
            expect(message).toContain('Thank you for your order');
        });
    });


    // End-to-End Scenarios
    test.describe('End-to-End Scenarios', () => {
        test('should complete entire purchase flow', async ({ page }) => {
            await checkoutPage.fillShippingInformation('John', 'Doe', '12345');
            await checkoutPage.clickContinue();
            await checkoutPage.clickFinish();
            await expect(page).toHaveURL(/.*checkout-complete.html/);
            await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
        });


        test('should purchase multiple products', async ({ page }) => {
            await page.locator('#cancel').click();
            await cartPage.continueShopping();
            await productsPage.addProductToCartByName('Sauce Labs Bike Light');
            await productsPage.clickShoppingCart();
            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount).toBe(2);
            await cartPage.clickCheckout();
            await checkoutPage.fillShippingInformation('Jane', 'Smith', '54321');
            await checkoutPage.clickContinue();
            const items = await page.locator('.cart_item').all();
            expect(items.length).toBe(2);
            await checkoutPage.clickFinish();
            await expect(checkoutPage.completeHeader).toBeVisible();
        });
    });
});
