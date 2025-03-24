import knex from 'knex';

import { buildOrderService } from '../domain/order';
import { buildPostgresqlOrderRepository } from '../infrastructure/repositories/order/pgsql';

// import the connection infos from your config (.env)
const db = knex({
    client: 'pg',
    version: '7.2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'your_database_user',
        password: 'your_database_password',
        database: 'my_app',
    },
});

const orderRepository = buildPostgresqlOrderRepository({ db });
const orderService = buildOrderService({ orderRepository });

// ...
// build API, start HTTP server, ...
// ...
