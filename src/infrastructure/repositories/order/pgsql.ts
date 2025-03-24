import { Knex } from 'knex';
import { Order, LineItem, OrderRepository } from '../../../domain/order';

interface PostgresqlOrderRepositoryDependencies {
    db: Knex;
}

type OrderRow = {
    id: string;
    customer_id: string;
    order_date: Date;
    cancellation_date?: Date;
    total_amount: number;
};

type LineItemRow = {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
};

const transformOrderRowToOrder = (
    orderRow: OrderRow,
    lineItemRows: LineItemRow[],
): Order => {
    return {
        id: orderRow.id,
        customerId: orderRow.customer_id,
        orderDate: orderRow.order_date,
        cancellationDate: orderRow.cancellation_date,
        totalAmount: orderRow.total_amount,
        lineItems: lineItemRows.map((lineItem) => ({
            id: lineItem.id,
            productId: lineItem.product_id,
            quantity: lineItem.quantity,
            price: lineItem.price,
        })),
    };
};

const transformOrderToOrderRow = (order: Order): OrderRow => {
    return {
        id: order.id,
        customer_id: order.customerId,
        order_date: order.orderDate,
        cancellation_date: order.cancellationDate,
        total_amount: order.totalAmount,
    };
};

const transformLineItemsToLineItemRows = (
    orderId: string,
    lineItems: LineItem[],
): LineItemRow[] => {
    return lineItems.map((lineItem) => {
        return {
            id: lineItem.id,
            order_id: orderId,
            product_id: lineItem.productId,
            quantity: lineItem.quantity,
            price: lineItem.price,
        };
    });
};

export const buildPostgresqlOrderRepository = (
    dependencies: PostgresqlOrderRepositoryDependencies,
): OrderRepository => {
    const { db } = dependencies;

    const getById = async (id: string): Promise<Order | undefined> => {
        const orderRows = await db
            .select('*')
            .from<OrderRow>('orders')
            .where('id', id);

        if (orderRows.length === 0) {
            return undefined;
        }

        const lineItemRows = await db
            .select('*')
            .from<LineItemRow>('line_items')
            .where('order_id', id);

        return transformOrderRowToOrder(orderRows[0], lineItemRows);
    };

    const getByCustomerId = async (customerId: string): Promise<Order[]> => {
        const orders = await db
            .select('*')
            .from<OrderRow>('orders')
            .where('customer_id', customerId);

        const ordersItems = await db
            .select('*')
            .from<LineItemRow>('line_items')
            .where(
                'order_id',
                orders.map((order) => order.id),
            );

        return orders.map((order) =>
            transformOrderRowToOrder(
                order,
                ordersItems.filter((item) => item.order_id === order.id),
            ),
        );
    };

    const upsert = async (order: Order): Promise<void> => {
        await db.transaction(async (trx) => {
            await trx('orders').upsert([transformOrderToOrderRow(order)]);

            await trx('line_items').upsert(
                transformLineItemsToLineItemRows(order.id, order.lineItems),
            );
        });
    };

    return { getById, getByCustomerId, upsert };
};
