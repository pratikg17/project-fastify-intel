const moment = require('moment');
const OrderService = require('../../service/orders.service');
const {
  postRequestBody,
  queryParameter,
  updateOrderRequestBody,
} = require('./Orders.schema');

// mark this function as async - required
const orderRoute = async (fastify) => {
  const { createOrder, getOrders, getAllOrders, updateOrder } =
    OrderService(fastify);

  fastify.get(
    '/',
    { schema: { querystring: queryParameter } },
    async (request, reply) => {
      // authenticate request
      // append user request.user
      await fastify.authenticate(request, reply);

      const { limit, offset } = request.query;

      const orders = await getOrders(limit, offset);
      reply.code(200).send({ orders });
    }
  );

  fastify.get('/get-all-orders', async (request, reply) => {
    // authenticate request
    // append user request.user
    await fastify.authenticate(request, reply);

    const orders = await getAllOrders();
    reply.code(200).send({ orders });
  });

  fastify.post(
    '/',
    {
      schema: { body: postRequestBody },
    },
    async (request, reply) => {
      // authenticate request
      await fastify.authenticate(request, reply);

      const order = request.body;

      const orderId = await createOrder(order);

      reply.code(201).send({ orderId });
    }
  );

  fastify.post(
    '/place-order',
    {
      schema: { body: postRequestBody },
    },
    async (request, reply) => {
      // authenticate request
      await fastify.authenticate(request, reply);
      const order = request.body;
      const orderData = await createOrder(order);
      reply.code(201).send({ orderId: orderData.order_id });
    }
  );

  fastify.post(
    '/update-order',
    {
      schema: { body: updateOrderRequestBody },
    },
    async (request, reply) => {
      // authenticate request
      await fastify.authenticate(request, reply);

      const order = request.body;

      const orderId = await updateOrder(order);

      reply.code(201).send({ orderId });
    }
  );
};

module.exports = orderRoute;
