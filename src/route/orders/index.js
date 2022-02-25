const moment = require('moment');
const OrderService = require('../../service/orders.service');
const {
  postRequestBody,
  queryParameter,
  queryParameterOrders,
  updateOrderRequestBody,
  deleteOrderReqObj,
} = require('./Orders.schema');

// mark this function as async - required
const orderRoute = async (fastify) => {
  const {
    createOrder,
    getAllOrders,
    getOrdersByUserId,
    updateOrder,
    deleteOrder,
  } = OrderService(fastify);

  fastify.get('/get-all-orders', async (request, reply) => {
    await fastify.authenticate(request, reply);

    const orders = await getAllOrders();
    reply.code(200).send({ orders });
  });

  fastify.get(
    '/get-all-user-orders',
    {
      schema: { querystring: queryParameterOrders },
    },
    async (request, reply) => {
      await fastify.authenticate(request, reply);
      const { user_id } = request.query;
      const orders = await getOrdersByUserId(user_id);
      reply.code(200).send({ orders });
    }
  );

  fastify.post(
    '/delete-order',
    { schema: { body: deleteOrderReqObj } },
    async (request, reply) => {
      await fastify.authenticate(request, reply);
      const { orderId } = request.body;
      const orders = await deleteOrder(orderId);
      reply.code(200).send({ orders });
    }
  );

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
