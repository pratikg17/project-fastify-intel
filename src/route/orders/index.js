const moment = require('moment');
const OrderService = require('../../service/Orders.service');
const { postRequestBody, queryParameter } = require('./Orders.schema');

// mark this function as async - required
const stockRoute = async (fastify) => {
  const { createStock, getOrders, getAllOrders, updateStock } =
    OrdersService(fastify);

  fastify.get(
    '/',
    { schema: { querystring: queryParameter } },
    async (request, reply) => {
      // authenticate request
      // append user request.user
      await fastify.authenticate(request, reply);

      const { limit, offset } = request.query;

      const Orders = await getOrders(limit, offset);
      reply.code(200).send({ Orders });
    }
  );

  fastify.get('/get-all-orders', async (request, reply) => {
    // authenticate request
    // append user request.user
    await fastify.authenticate(request, reply);

    const Orders = await getAllOrders();
    reply.code(200).send({ Orders });
  });

  fastify.post(
    '/',
    {
      schema: { body: postRequestBody },
    },
    async (request, reply) => {
      // authenticate request
      await fastify.authenticate(request, reply);

      const stock = request.body;

      const stockId = await createStock(stock);

      reply.code(201).send({ stockId });
    }
  );

  fastify.post(
    '/update-stock',
    {
      schema: { body: postRequestBody },
    },
    async (request, reply) => {
      // authenticate request
      await fastify.authenticate(request, reply);

      const stock = request.body;

      const stockId = await updateStock(stock);

      reply.code(201).send({ stockId });
    }
  );
};

module.exports = stockRoute;
