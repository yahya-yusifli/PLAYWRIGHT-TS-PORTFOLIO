import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../page-objects/saucedemo/LoginPage';
import { ProductsPage } from '../../../page-objects/saucedemo/ProductsPage';


test.describe('SauceDemo Login Tests', () => {

  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
  });

  // Valid Login Scenarios
  test.describe('Valid Login Scenarios', () => {
    
    test('should login with standard user', async ({ page }) => {
      await loginPage.login(process.env.SAUCEDEMO_STANDARD_USER!, process.env.SAUCEDEMO_PASSWORD!);
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(productsPage.pageTitle).toHaveText('Products');
    });


    test('should login with performance glitch user', async ({ page }) => {
      await loginPage.login(process.env.SAUCEDEMO_PERFORMANCE_USER!, process.env.SAUCEDEMO_PASSWORD!);
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(productsPage.pageTitle).toHaveText('Products');
    });


    test('should login with problem user', async ({ page }) => {
      await loginPage.login(process.env.SAUCEDEMO_PROBLEM_USER!, process.env.SAUCEDEMO_PASSWORD!);
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(productsPage.pageTitle).toHaveText('Products');
    });


    test('should login with visual user', async ({ page }) => {
      await loginPage.login('visual_user', process.env.SAUCEDEMO_PASSWORD!);
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(productsPage.pageTitle).toHaveText('Products');
    });

    test('should login with error user', async ({ page }) => {
      await loginPage.login('error_user', process.env.SAUCEDEMO_PASSWORD!);
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(productsPage.pageTitle).toHaveText('Products');
    });
  });

  // Invalid Credentials Handling
  test.describe('Invalid Credentials Handling', () => {

    test('should show error for locked out user', async () => {
      await loginPage.login('locked_out_user', process.env.SAUCEDEMO_PASSWORD!);
      await expect(loginPage.errorMessage).toBeVisible();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Sorry, this user has been locked out');
    });

    test('should show error for invalid username', async () => {
      await loginPage.login('invalid_user', process.env.SAUCEDEMO_PASSWORD!);
      await expect(loginPage.errorMessage).toBeVisible();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Username and password do not match');
    });

    test('should show error for invalid password', async () => {
      await loginPage.login(process.env.SAUCEDEMO_STANDARD_USER!, 'wrong_password');
      await expect(loginPage.errorMessage).toBeVisible();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Username and password do not match');
    });

    test('should handle wrong username format', async () => {
      await loginPage.login('user@domain.com', 'secret_sauce');
      await expect(loginPage.errorMessage).toBeVisible();
    });

    test('should reject SQL injection attempts', async () => {
      await loginPage.login("admin' OR '1'='1", "admin' OR '1'='1");
      await expect(loginPage.errorMessage).toBeVisible();
    });

    test('should reject XSS attempts', async () => {
      await loginPage.login('<script>alert("XSS")</script>', 'secret_sauce');
      await expect(loginPage.errorMessage).toBeVisible();
    });

    test('should be case sensitive', async () => {
      await loginPage.login('STANDARD_USER', process.env.SAUCEDEMO_PASSWORD!);
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  // Empty Field Validation
  test.describe('Empty Field Validation', () => {

    test('should show error for empty username', async () => {
      await loginPage.login('', process.env.SAUCEDEMO_PASSWORD!);
      await expect(loginPage.errorMessage).toBeVisible();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Username is required');
    });

    test('should show error for empty password', async () => {
      await loginPage.login('standard_user', '');
      await expect(loginPage.errorMessage).toBeVisible();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Password is required');
    });
  });
});
