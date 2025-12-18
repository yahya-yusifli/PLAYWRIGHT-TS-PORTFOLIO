import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../page-objects/saucedemo/LoginPage';
import { SauceDemoUsers } from '../../../utils/test-data';

const testUsers = [
    { username: SauceDemoUsers.standard.username, password: SauceDemoUsers.standard.password, shouldSucceed: true },
    { username: SauceDemoUsers.locked.username, password: SauceDemoUsers.locked.password, shouldSucceed: false },
    { username: SauceDemoUsers.problem.username, password: SauceDemoUsers.problem.password, shouldSucceed: true },
    { username: 'invalid_user', password: 'wrong_password', shouldSucceed: false }
];

test.describe('SauceDemo Login with Multiple Users @smoke', () => {
    
  testUsers.forEach((user, index) => {
    test(`User #${index + 1} - login test (${user.username || 'undefined'})`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await loginPage.login(
        user.username as string,
        user.password as string
      );

      if (user.shouldSucceed) {
        await expect(page).toHaveURL(/inventory\.html/);
      } else {
        await expect(loginPage.errorMessage).toBeVisible();
      }
    });
  });
});