const moment = require('moment');
const StockService = require('../../service/stocks.service');
const { postRequestBody, queryParameter } = require('./stocks.schema');

// mark this function as async - required
const stockRoute = async (fastify) => {
  const { createStock, getStocks } = StockService(fastify);

  fastify.get(
    '/',
    { schema: { querystring: queryParameter } },
    async (request, reply) => {
      // authenticate request
      // append user request.user
      await fastify.authenticate(request, reply);

      const { limit, offset } = request.query;

      const stocks = await getStocks(limit, offset);
      reply.code(200).send({ stocks });
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

      const stock = request.body;

      const stockId = await createStock(stock);

      reply.code(201).send({ stockId });
    }
  );
};

module.exports = stockRoute;
