import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test.describe('SauceDemo Login Tests', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {

        loginPage = new LoginPage(page);

        await loginPage.navigate();
    });

    test('Valid login', async ({ page }) => {

        await loginPage.login(
            'standard_user',
            'secret_sauce'
        );

        await expect(
            page.locator('.title')
        ).toHaveText('Products');
    });


    test('Invalid username', async () => {

        await loginPage.login(
            'invalid_user',
            'secret_sauce'
        );

        await expect(
            loginPage.errorMessage
        ).toBeVisible();
    });


    test('Invalid password', async () => {

        await loginPage.login(
            'standard_user',
            'wrong_password'
        );

        await expect(
            loginPage.errorMessage
        ).toBeVisible();
    });


    test('Invalid username and password', async () => {

        await loginPage.login(
            'invalid_user',
            'wrong_password'
        );

        await expect(
            loginPage.errorMessage
        ).toBeVisible();
    });


    test('Locked out user', async () => {

        await loginPage.login(
            'locked_out_user',
            'secret_sauce'
        );

        await expect(
            loginPage.errorMessage
        ).toContainText('locked out');
    });


    test('Empty username', async () => {

        await loginPage.login(
            '',
            'secret_sauce'
        );

        await expect(
            loginPage.errorMessage
        ).toBeVisible();
    });


    test('Empty password', async () => {

        await loginPage.login(
            'standard_user',
            ''
        );

        await expect(
            loginPage.errorMessage
        ).toBeVisible();
    });


    test('Empty username and password', async () => {

        await loginPage.login(
            '',
            ''
        );

        await expect(
            loginPage.errorMessage
        ).toBeVisible();
    });

});