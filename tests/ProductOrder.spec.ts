import { test, expect } from '@playwright/test';

import { LoginPage } from '../Pages/LoginPage';
import { ProductsPage } from '../Pages/ProductPage';
import { CartPage } from '../Pages/CartPage';
import { CheckoutPage } from '../Pages/CheckOutPage';

test.describe('SauceDemo Order Tests', () => {

    test('Complete one product order', async ({ page }) => {

        const loginPage =
            new LoginPage(page);

        const productsPage =
            new ProductsPage(page);

        const cartPage =
            new CartPage(page);

        const checkoutPage =
            new CheckoutPage(page);


        // Login

        await loginPage.navigate();

        await loginPage.login(
            'standard_user',
            'secret_sauce'
        );


        // Verify Products page

        await expect(
            productsPage.productTitle
        ).toHaveText('Products');


        // Add one product

        await productsPage.addBackpackToCart();


        // Open cart

        await productsPage.openCart();


        // Verify product

        await expect(
            cartPage.backpack
        ).toBeVisible();


        // Checkout

        await cartPage.checkout();


        // Customer information

        await checkoutPage.enterCustomerDetails(
            'John',
            'Doe',
            '600001'
        );


        // Continue

        await checkoutPage.continueCheckout();


        // Finish

        await checkoutPage.finishOrder();


        // Verify successful order

        await expect(
            checkoutPage.successMessage
        ).toHaveText(
            'Thank you for your order!'
        );
    });

});