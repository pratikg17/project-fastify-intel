const moment = require('moment');
const OrderService = require('../../service/orders.service');
const {
  postRequestBody,
  queryParameter,
  queryParameterUserId,
  updateOrderRequestBody,
  deleteOrderReqObj,
  addTradeReqObj,
} = require('./Orders.schema');

// mark this function as async - required
const orderRoute = async (fastify) => {
  const {
    createOrder,
    getAllOrders,
    getOrdersByUserId,
    updateOrder,
    deleteOrder,
    addNewTrade,
    getAllTrades,
    getTradesByUserId,
    getInvestorPortfolio,
  } = OrderService(fastify);

  fastify.get('/get-all-orders', async (request, reply) => {
    await fastify.authenticate(request, reply);

    const orders = await getAllOrders();
    reply.code(200).send({ orders });
  });

  fastify.get(
    '/get-all-user-orders',
    {
      schema: { querystring: queryParameterUserId },
    },
    async (request, reply) => {
      await fastify.authenticate(request, reply);
      const { user_id } = request.query;
      const orders = await getOrdersByUserId(user_id);
      reply.code(200).send({ orders });
    }
  );

  fastify.get('/get-all-trades', async (request, reply) => {
    await fastify.authenticate(request, reply);

    const trades = await getAllTrades();
    reply.code(200).send({ trades });
  });

  fastify.get(
    '/get-all-user-trades',
    {
      schema: { querystring: queryParameterUserId },
    },
    async (request, reply) => {
      await fastify.authenticate(request, reply);
      const { user_id } = request.query;
      const trades = await getTradesByUserId(user_id);
      reply.code(200).send({ trades });
    }
  );

  fastify.get(
    '/get-user-portfolio',
    {
      schema: { querystring: queryParameterUserId },
    },
    async (request, reply) => {
      await fastify.authenticate(request, reply);
      const { user_id } = request.query;
      const trades = await getInvestorPortfolio(user_id);
      reply.code(200).send({ trades });
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

  fastify.post(
    '/add-trade',
    {
      schema: { body: addTradeReqObj },
    },
    async (request, reply) => {
      // authenticate request
      await fastify.authenticate(request, reply);
      const trade = request.body;
      const tradeData = await addNewTrade(trade);
      reply.code(201).send({ tradeData });
    }
  );

  fastify.post('/fluctuate-market', async (request, reply) => {
    // authenticate request
    await fastify.authenticate(request, reply);
    const trade = request.body;
    const tradeData = await addNewTrade(trade);
    reply.code(201).send({ tradeData });
  });
};

module.exports = orderRoute;
