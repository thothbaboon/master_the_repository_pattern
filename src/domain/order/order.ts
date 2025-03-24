export type LineItem = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
};

export type Order = {
    id: string;
    customerId: string;
    orderDate: Date;
    totalAmount: number;
    lineItems: LineItem[];
    cancellationDate?: Date;
};

export interface OrderRepository {
    getById: (id: string) => Promise<Order | undefined>;
    getByCustomerId: (customerId: string) => Promise<Order[]>;
    upsert: (order: Order) => Promise<void>;
}

export type CancelOrderResult =
    | { outcome: 'notCancelled'; reason: 'orderNotFound' }
    | { outcome: 'notCancelled'; reason: 'alreadyCancelled' }
    | { outcome: 'cancelled' };

export interface OrderService {
    cancelOrder: (id: string) => Promise<CancelOrderResult>;
    // other methods ...
}
