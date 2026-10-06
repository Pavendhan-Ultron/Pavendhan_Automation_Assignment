import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
    constructor(private request: APIRequestContext) {}

    async getBooks() {
        return await this.request.get('/books');
    }

    async getBook(bookId: number) {
        return await this.request.get(`/books/${bookId}`);
    }

    async createOrder(token: string, bookId: number, customerName: string) {
        return await this.request.post('/orders', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                bookId: bookId,
                customerName: customerName
            }
        });
    }

    async updateOrder(
        token: string,
        orderId: string,
        customerName: string
    ) {
        return await this.request.patch(`/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                customerName: customerName
            }
        });
    }

    async deleteOrder(token: string, orderId: string) {
        return await this.request.delete(`/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}