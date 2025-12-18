import { Page, Expect, expect } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;
    protected readonly baseUrl: string;

    constructor(page: Page) {
        this.page = page;
        this.baseUrl = process.env.BASE_URL?.trim() || "";

        if (!this.baseUrl) {
            throw new Error("BASE_URL is not defined. Set it in .env or playwright.config.ts");
        }
    }

    
    async goto(path: string = "/") {
        const targetUrl = this.normalizeUrl(path);
        await this.page.goto(targetUrl);
        await this.waitForPageLoad();
    }

    private normalizeUrl(path: string): string {
        if (!path.startsWith("/")) path = "/" + path;
        return this.baseUrl.replace(/\/$/, "") + path;
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
    }

    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async expectUrlContains(expected: string | RegExp) {
        await expect(this.page).toHaveURL(expected);
    }
}