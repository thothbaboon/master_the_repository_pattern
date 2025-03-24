import { Order, OrderRepository } from '../../../domain/order';

export const buildInMemoryOrderRepository = (): OrderRepository => {
    const ordersById = new Map<string, Order>();

    const getById = async (id: string): Promise<Order | undefined> => {
        const order = ordersById.get(id);
        return order;
    };

    const getByCustomerId = async (customerId: string): Promise<Order[]> => {
        const orders = Array.from(ordersById.values());
        return orders.filter((order) => order.customerId === customerId);
    };

    const upsert = async (order: Order): Promise<void> => {
        ordersById.set(order.id, order);
    };

    return { getById, getByCustomerId, upsert };
};
