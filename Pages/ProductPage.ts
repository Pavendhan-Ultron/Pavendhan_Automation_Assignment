import { Page, Locator } from '@playwright/test';

export class ProductsPage {

    readonly page: Page;
    readonly productTitle: Locator;
    readonly cartLink: Locator;
    readonly backpackAddButton: Locator;

    constructor(page: Page) {

        this.page = page;

        this.productTitle =
            page.locator('.title');

        this.cartLink =
            page.locator('.shopping_cart_link');

        this.backpackAddButton =
            page.locator('#add-to-cart-sauce-labs-backpack');
    }

    async addBackpackToCart() {

        await this.backpackAddButton.click();
    }

    async openCart() {

        await this.cartLink.click();
    }
}