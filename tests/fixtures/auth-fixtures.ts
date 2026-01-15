import { test as base, Page, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/saucedemo/LoginPage';
import { SauceDemoUsers } from '../../test-data/users';

type AuthFixtures = {
    loginPage: LoginPage;
    loggedInAsStandardUser: void;
    loggedInAsPerformanceUser: void;
    loggedInAsLockedUser: void;
    loggedInAsProblemUser: void;
};

async function loginAs(
    loginPage: LoginPage,
    page: Page,
    username: string,
    password: string
): Promise<void> {
    await loginPage.goto();
    await loginPage.login(username, password);
    await page.waitForURL('**/inventory.html');
}

export const test = base.extend<AuthFixtures>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    loggedInAsStandardUser: async ({ loginPage, page }, use) => {
        await loginAs(
            loginPage,
            page,
            SauceDemoUsers.standard.username!,
            SauceDemoUsers.standard.password!
        );
        await use();
    },

    loggedInAsPerformanceUser: async ({ loginPage, page }, use) => {
        await loginAs(
            loginPage,
            page,
            SauceDemoUsers.performance.username!,
            SauceDemoUsers.performance.password!
        );
        await use();
    },

    loggedInAsLockedUser: async ({ loginPage, page }, use) => {
        await loginAs(
            loginPage,
            page,
            SauceDemoUsers.locked.username!,
            SauceDemoUsers.locked.password!
        );
        await use();
    },

    loggedInAsProblemUser: async ({loginPage,page},use) => {
        await loginAs(
            loginPage,
            page,
            SauceDemoUsers.problem.username!,
            SauceDemoUsers.problem.password!
        );
        await use();
    }

});

export { expect };