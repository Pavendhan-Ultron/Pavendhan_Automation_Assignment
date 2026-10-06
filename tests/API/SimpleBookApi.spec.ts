
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../Utils/apiClient';

test.describe('Simple Books API Tests', () => {

    let apiClient: ApiClient;
    let token: string;

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


    // GET - Get all books
    test('GET - Get all books', async () => {

        const response = await apiClient.getBooks();

        expect(response.status()).toBe(200);

        const books = await response.json();

        expect(Array.isArray(books)).toBeTruthy();
        expect(books.length).toBeGreaterThan(0);

        console.log('Books:', books);
    });


    // GET - Get book by ID
    test('GET - Get book by ID', async () => {

        const response = await apiClient.getBook(1);

        expect(response.status()).toBe(200);

        const book = await response.json();

        expect(book.id).toBe(1);

        console.log('Book:', book);
    });


    // POST → PATCH → DELETE
    test('Order lifecycle - POST → PATCH → DELETE', async () => {

        // -------------------------
        // POST - Create an order
        // -------------------------

        const createResponse = await apiClient.createOrder(
            token,
            1,
            'Pavendhan'
        );

        expect(createResponse.status()).toBe(401);

        const createBody = await createResponse.json();

        expect(createBody.created).toBe(true);
        expect(createBody).toHaveProperty('orderId');

        const orderId = createBody.orderId;

        console.log('Order created:', orderId);


        // -------------------------
        // PATCH - Update the order
        // -------------------------

        const updateResponse = await apiClient.updateOrder(
            token,
            orderId,
            'Pavendhan Updated'
        );

        expect(updateResponse.status()).toBe(204);

        console.log('Order updated successfully');


        // -------------------------
        // DELETE - Delete the order
        // -------------------------

        const deleteResponse = await apiClient.deleteOrder(
            token,
            orderId
        );

        expect(deleteResponse.status()).toBe(204);

        console.log('Order deleted successfully');
    });

});

