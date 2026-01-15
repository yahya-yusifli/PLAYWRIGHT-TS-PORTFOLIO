import { test, expect } from '../../fixtures/auth-fixtures'
import { ProductsPage } from '../../../page-objects/saucedemo/ProductsPage';
import { CartPage } from '../../../page-objects/saucedemo/CartPage';


test.describe('SauceDemo Cart Tests', () => {

  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page,loggedInAsStandardUser }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
  });

  // Add Items to Cart
  test.describe('Add Items to Cart', () => {

    test('should add single item', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
    });

    test('should add multiple items', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      await productsPage.clickShoppingCart();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);
    });

    test('should add all items', async () => {
      const products = await productsPage.getProductNames();
      for (const product of products) {
        await productsPage.addProductToCartByName(product);
      }
      await productsPage.clickShoppingCart();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(products.length);
    });
  });

  // Remove Items from Cart
  test.describe('Remove Items from Cart', () => {

    test('should remove from products page', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.removeProductFromCartByName('Sauce Labs Backpack');
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe('0');
    });

    test('should remove from cart page', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      await cartPage.removeItemByName('Sauce Labs Backpack');
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });

    test('should remove multiple items', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      await productsPage.clickShoppingCart();
      await cartPage.removeItemByName('Sauce Labs Backpack');
      let itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
      await cartPage.removeItemByName('Sauce Labs Bike Light');
      itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });

    test('should remove all items', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      await productsPage.clickShoppingCart();
      const items = await cartPage.getCartItemNames();
      for (const item of items) {
        await cartPage.removeItemByName(item);
      }
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });
  });

  // Cart Navigation
  test.describe('Cart Navigation', () => {

    test('should navigate to cart from products', async ({ page }) => {
      await productsPage.clickShoppingCart();
      await expect(page).toHaveURL(/.*cart.html/);
      await expect(cartPage.pageTitle).toHaveText('Your Cart');
    });

    test('should continue shopping from cart', async ({ page }) => {
      await productsPage.clickShoppingCart();
      await cartPage.continueShopping();
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(cartPage.pageTitle).toHaveText('Products');
    });

    test('should navigate back and forth', async ({ page }) => {
      await productsPage.clickShoppingCart();
      await expect(page).toHaveURL(/.*cart.html/);
      await cartPage.continueShopping();
      await expect(page).toHaveURL(/.*inventory.html/);
      await productsPage.clickShoppingCart();
      await expect(page).toHaveURL(/.*cart.html/);
    });
  });

  // Cart Calculations
  test.describe('Cart Calculations', () => {

    test('should calculate single item total', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      const price = await productsPage.getProductPrice('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      const cartPrice = await cartPage.getItemPrice('Sauce Labs Backpack');
      expect(price).toBe(cartPrice);
    });

    test('should calculate multiple items total', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      await productsPage.clickShoppingCart();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);
    });

    test('should show correct cart badge count', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      let badgeCount = await productsPage.getCartItemCount();
      expect(badgeCount).toBe('1');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      badgeCount = await productsPage.getCartItemCount();
      expect(badgeCount).toBe('2');
    });
  });

  // Cart Item Details
  test.describe('Cart Item Details', () => {

    test('should display item details correctly', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      const isInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
      expect(isInCart).toBeTruthy();
      const price = await cartPage.getItemPrice('Sauce Labs Backpack');
      expect(price).toContain('$');
    });

    test('should show product description in cart', async ({ page }) => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      const desc = await page.locator('.inventory_item_desc').textContent();
      expect(desc).toBeTruthy();
    });
  });

  // Empty Cart Scenarios
  test.describe('Empty Cart Scenarios', () => {

    test('should display empty cart correctly', async () => {
      await productsPage.clickShoppingCart();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });

    test('should show empty cart after removing all', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      await cartPage.removeItemByName('Sauce Labs Backpack');
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });

    test('should show checkout button with items', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      await expect(cartPage.checkoutButton).toBeVisible();
      await expect(cartPage.checkoutButton).toBeEnabled();
    });
  });

  // Cart Persistence
  test.describe('Cart Persistence', () => {

    test('should maintain items across navigation', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      await cartPage.continueShopping();
      await productsPage.clickShoppingCart();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
      const isInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
      expect(isInCart).toBeTruthy();
    });
  });

  // Verification Methods
  test.describe('Verification Methods', () => {

    test('should verify product in cart', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.clickShoppingCart();
      const isInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
      expect(isInCart).toBeTruthy();
    });

    test('should verify cart contents', async () => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      await productsPage.clickShoppingCart();
      const items = await cartPage.getCartItemNames();
      expect(items).toContain('Sauce Labs Backpack');
      expect(items).toContain('Sauce Labs Bike Light');
    });
  });

  // Cart Display Details
  test.describe('Cart Display Details', () => {

    test('should show quantity for multiple items', async ({ page }) => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      await productsPage.clickShoppingCart();

      const quantities = page.locator('.cart_quantity');

      await expect(quantities).toHaveCount(2);
      await expect(quantities.first()).toHaveText('1');
      await expect(quantities.nth(1)).toHaveText('1');
    });

    test('should display product descriptions', async ({ page }) => {
      await productsPage.addProductToCartByName('Sauce Labs Backpack');
      await productsPage.addProductToCartByName('Sauce Labs Bike Light');
      await productsPage.clickShoppingCart();
      const descriptions = page.locator('.inventory_item_desc');
      expect(descriptions).toHaveCount(2);
    });
  });
});
