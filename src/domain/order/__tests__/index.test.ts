import { buildOrderService, Order } from '../index';
import { buildInMemoryOrderRepository } from '../../../infrastructure/repositories/order/inMemory';

// example of a unit test, testing the order service method cancelOrder, and using the in memory repository

describe('cancelOrder', () => {
    const orderRepository = buildInMemoryOrderRepository();
    const orderService = buildOrderService({ orderRepository });

    describe('given the id of an existing order', () => {
        describe('given the order is already cancelled', () => {
            const id = 'order1';
            const order: Order = {
                id,
                customerId: 'customerId',
                orderDate: new Date(),
                cancellationDate: new Date(),
                totalAmount: 100,
                lineItems: [
                    {
                        id: 'lineItem1',
                        productId: 'product1',
                        price: 50,
                        quantity: 2,
                    },
                ],
            };

            beforeEach(async () => {
                await orderRepository.upsert(order);
            });

            it('returns an error because the order is already cancelled', async () => {
                const result = await orderService.cancelOrder(id);

                expect(result).toEqual({
                    outcome: 'notCancelled',
                    reason: 'alreadyCancelled',
                });
            });
        });
        // other tests ...
    });

    // other tests  ...
});
