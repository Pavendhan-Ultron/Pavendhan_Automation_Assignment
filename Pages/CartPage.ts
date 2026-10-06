import { Page, Locator } from '@playwright/test';

export class CartPage {

    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly backpack: Locator;

    constructor(page: Page) {

        this.page = page;

        this.backpack =
            page.getByText('Sauce Labs Backpack');

        this.checkoutButton =
            page.locator('#checkout');
    }

    async verifyProductAdded() {

        return await this.backpack.isVisible();
    }

    async checkout() {

        await this.checkoutButton.click();
    }
}