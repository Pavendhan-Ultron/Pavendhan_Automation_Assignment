import { test, expect } from '@playwright/test';
import { ApiClient } from '../../Utils/apiClient';

test.describe('Simple Books API Tests', () => {

    let apiClient: ApiClient;
    let token: string;
    let orderId: string;

    test.beforeAll(async ({ playwright }) => {

        const request = await playwright.request.newContext({
            baseURL: 'https://simple-books-api.glitch.me'
        });

        apiClient = new ApiClient(request);

        // Create API client token
        const tokenResponse = await request.post('/api-clients', {
            data: {
                clientName: 'Pavendhan Automation',
                clientEmail: `pavendhan_${Date.now()}@example.com`
            }
        });

        expect(tokenResponse.status()).toBe(201);

        const tokenResponseBody = await tokenResponse.json();

        token = tokenResponseBody.accessToken;

        console.log('Token generated successfully');
    });

    test('GET - Get all books', async () => {

        const response = await apiClient.getBooks();

        expect(response.status()).toBe(200);

        const books = await response.json();

        expect(Array.isArray(books)).toBeTruthy();

        expect(books.length).toBeGreaterThan(0);

        console.log('Books:', books);
    });


    test('GET - Get book by ID', async () => {

        const response = await apiClient.getBook(1);

        expect(response.status()).toBe(200);

        const book = await response.json();

        expect(book.id).toBe(1);

        console.log('Book:', book);
    });


    test('POST - Create an order', async () => {

        const response = await apiClient.createOrder(
            token,
            1,
            'Pavendhan'
        );

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('created');

        expect(responseBody.created).toBe(true);

        orderId = responseBody.orderId;

        console.log('Order ID:', orderId);
    });


    test('PATCH - Update an order', async () => {

        test.skip(!orderId, 'Order ID is not available');

        const response = await apiClient.updateOrder(
            token,
            orderId,
            'Pavendhan Updated'
        );

        expect(response.status()).toBe(204);

        console.log('Order updated successfully');
    });


    test('DELETE - Delete an order', async () => {

        test.skip(!orderId, 'Order ID is not available');

        const response = await apiClient.deleteOrder(
            token,
            orderId
        );

        expect(response.status()).toBe(204);

        console.log('Order deleted successfully');
    });

});