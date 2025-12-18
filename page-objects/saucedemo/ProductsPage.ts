import { Page, Locator } from "@playwright/test";
import { BasePage } from "../shared/BasePage";
import { SortOption } from "../../utils/saucedemo-data";

export class ProductsPage extends BasePage {
    readonly pageTitle: Locator;
    readonly inventoryItems: Locator;
    readonly shoppingCartBadge: Locator;
    readonly shoppingCartLink: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.locator('[data-test="title"]');
        this.inventoryItems = page.locator(".inventory_item");
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
        this.shoppingCartLink = page.locator("[data-test=shopping-cart-link]");
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }

    async goto() {
        await super.goto("/inventory.html");
    }
    

    async getProductCount(): Promise < number > {
        return await this.inventoryItems.count();
    }

    async getProductNames(): Promise < string[] > {
        const items = await this.inventoryItems.all();
        const names: string[] = [];

        for(const item of items) {
            const name = await item.locator(".inventory_item_name").textContent();
            if (name) names.push(name);
        }
        return names;
    }

    async addProductToCartByName(productName: string) {
        const product = this.page.locator(".inventory_item", { hasText: productName });
        await product.locator('button:has-text("Add to cart")').click();
    }

    async removeProductFromCartByName(productName: string) {
        const product = this.page.locator('.inventory_item', { hasText: productName });
        await product.locator('button:has-text("Remove")').click();
    }

    async getCartItemCount(): Promise < string > {
        try {
            return await this.shoppingCartBadge.textContent() || '0';
        } catch {
            return '0';
        }
    }

    async clickShoppingCart() {
        await this.shoppingCartLink.click();
    }

    async sortBy(option: SortOption) {
        await this.sortDropdown.selectOption(option);
    }

    async getProductPrice(productName: string): Promise < string > {
        const product = this.page.locator('.inventory_item', { hasText: productName });
        return await product.locator('.inventory_item_price').textContent() || '';
    }

    async isProductInCart(productName: string): Promise < boolean > {
        const product = this.page.locator('.inventory_item', { hasText: productName });
        const removeButton = product.locator('button:has-text("Remove")');
        return await removeButton.isVisible();
    }

    async goToCart() {
        await this.shoppingCartLink.click();
    }
};

