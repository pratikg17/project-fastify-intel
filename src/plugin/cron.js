const fp = require('fastify-plugin');
const fastifyCron = require('fastify-cron');
const StockRepository = require('../dao/stocks.dao');

module.exports = fp(async (fastify, options, next) => {
  fastify.register(fastifyCron, {
    jobs: [
      {
        // Only these two properties are required,
        // the rest is from the node-cron API:
        // https://github.com/kelektiv/node-cron#api
        cronTime: '* * * * *', // Everyday at midnight UTC
        // start: true,
        // Note: the callbacks (onTick & onComplete) take the server
        // as an argument, as opposed to nothing in the node-cron API:
        onTick: async (server) => {
          // console.log(server);
          //   console.log('Make change to stock prices');
          //   const { getAllStocksDao } = StockRepository(server.db);
          //   const stocks = await getAllStocksDao();
          //   console.log(stocks);
        },
      },
    ],
  });
  next();
});
