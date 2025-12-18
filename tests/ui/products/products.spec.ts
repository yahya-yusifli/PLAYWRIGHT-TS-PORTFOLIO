import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../page-objects/saucedemo/LoginPage';
import { ProductsPage } from '../../../page-objects/saucedemo/ProductsPage';
import { SortOption } from '../../../utils/saucedemo-data';


test.describe('SauceDemo Product Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;


  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });


  // Product Display Verification
  test.describe('Product Display Verification', () => {
    test('should display all products', async () => {
      const productCount = await productsPage.getProductCount();
      expect(productCount).toBe(6);
    });


    test('should have correct product count', async () => {
      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
      expect(count).toBe(6);
    });


    test('should display page title', async () => {
      await expect(productsPage.pageTitle).toBeVisible();
      await expect(productsPage.pageTitle).toHaveText('Products');
    });


    test('should have visible product container', async () => {
      await expect(productsPage.inventoryItems.first()).toBeVisible();
    });


    test('should display all product names', async () => {
      const names = await productsPage.getProductNames();
      expect(names.length).toBe(6);
      names.forEach(name => expect(name).toBeTruthy());
    });


    test('should display all product prices', async () => {
      const products = await productsPage.inventoryItems.all();
      for (const product of products) {
        const price = await product.locator('.inventory_item_price').textContent();
        expect(price).toContain('$');
      }
    });
  });


  // Sorting Functionality
  test.describe('Sorting Functionality', () => {
    test('should have default sort as A-Z', async () => {
      const names = await productsPage.getProductNames();
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });


    test('should sort products A to Z', async () => {
      await productsPage.sortBy(SortOption.NAME_ASC);
      const names = await productsPage.getProductNames();
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });


    test('should sort products Z to A', async () => {
      await productsPage.sortBy(SortOption.NAME_DESC);
      const names = await productsPage.getProductNames();
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);
    });


    test('should sort price low to high', async () => {
      await productsPage.sortBy(SortOption.PRICE_LOW_HIGH);
      const names = await productsPage.getProductNames();
      expect(names[0]).toBe('Sauce Labs Onesie');
    });


    test('should sort price high to low', async () => {
      await productsPage.sortBy(SortOption.PRICE_HIGH_LOW);
      const names = await productsPage.getProductNames();
      expect(names[0]).toBe('Sauce Labs Fleece Jacket');
    });
  });


  // Add to Cart Operations
  test.describe('Add to Cart Operations', () => {
    test('should add single product to cart', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('1');
    });


    test('should add multiple products to cart', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('2');
    });


    test('should add product by index', async () => {
      const products = await productsPage.inventoryItems.all();
      await products[0].locator('button:has-text("Add to cart")').click();
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('1');
    });


    test('should change button to Remove after adding', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      const isInCart = await productsPage.isProductInCart('Sauce Labs Backpack');
      expect(isInCart).toBeTruthy();
    });


    test('should update cart badge when adding items', async () => {
      let cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('0');
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('1');
    });
  });


  // Remove from Cart Operations
  test.describe('Remove from Cart Operations', () => {
    test('should remove single product from cart', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.removeProductFromCartByName('Sauce Labs Backpack');
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('0');
    });


    test('should decrement cart badge when removing', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      let cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('2');
      await productsPage.removeProductFromCartByName('Sauce Labs Backpack');
      cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('1');
    });
  });


  // Product Navigation
  test.describe('Product Navigation', () => {
    test('should navigate to product detail', async ({ page }) => {
      await page.locator('.inventory_item_name').first().click();
      await expect(page).toHaveURL(/.*inventory-item.html/);
    });


    test('should navigate to cart', async ({ page }) => {
      await productsPage.clickShoppingCart();
      await expect(page).toHaveURL(/.*cart.html/);
    });
  });


  // Product Information
  test.describe('Product Information', () => {
    test('should display product names correctly', async () => {
      const names = await productsPage.getProductNames();
      expect(names).toContain('Sauce Labs Backpack');
      expect(names).toContain('Sauce Labs Bike Light');
    });


    test('should display product prices correctly', async () => {
      const price = await productsPage.getProductPrice('Sauce Labs Backpack');
      expect(price).toContain('$');
      expect(parseFloat(price.replace('$', ''))).toBeGreaterThan(0);
    });


    test('should have correct product details', async () => {
      const products = await productsPage.inventoryItems.all();
      for (const product of products) {
        const name = await product.locator('.inventory_item_name').textContent();
        const desc = await product.locator('.inventory_item_desc').textContent();
        const price = await product.locator('.inventory_item_price').textContent();
        expect(name).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(price).toBeTruthy();
      }
    });
  });


  // User Menu
  test.describe('User Menu', () => {
    test('should logout successfully', async ({ page }) => {
      await page.locator('#react-burger-menu-btn').click();
      await page.locator('#logout_sidebar_link').click();
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
  });
});
