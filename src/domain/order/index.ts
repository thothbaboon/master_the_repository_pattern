import {
    Order,
    LineItem,
    OrderRepository,
    OrderService,
    CancelOrderResult,
} from './order';

export { Order, LineItem, OrderRepository, OrderService, CancelOrderResult };

interface OrderServiceDependencies {
    orderRepository: OrderRepository;
}

export const buildOrderService = (
    dependencies: OrderServiceDependencies,
): OrderService => {
    const { orderRepository } = dependencies;

    const cancelOrder = async (id: string): Promise<CancelOrderResult> => {
        const order = await orderRepository.getById(id);

        if (!order) {
            return { outcome: 'notCancelled', reason: 'orderNotFound' };
        }

        if (order.cancellationDate) {
            return { outcome: 'notCancelled', reason: 'alreadyCancelled' };
        }

        order.cancellationDate = new Date();

        await orderRepository.upsert(order);

        return { outcome: 'cancelled' };
    };

    return { cancelOrder };
};
