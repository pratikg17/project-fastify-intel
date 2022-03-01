const fp = require('fastify-plugin');
const fastifyCron = require('fastify-cron');
const OrderService = require('../service/orders.service');
module.exports = fp(async (fastify, options, next) => {
  const { fluctuateStockPrice, updateExpiredOrder, deleteOldStockRecord } =
    OrderService(fastify);

  fastify.register(fastifyCron, {
    jobs: [
      {
        // Only these two properties are required,
        // the rest is from the node-cron API:
        // https://github.com/kelektiv/node-cron#api
        cronTime: '* * * * *', // Every minute
        start: true,
        // Note: the callbacks (onTick & onComplete) take the server
        // as an argument, as opposed to nothing in the node-cron API:
        onTick: async (server) => {
          console.log('Cronjob- start');
          await fluctuateStockPrice(fastify);
        },
      },
      {
        // Only these two properties are required,
        // the rest is from the node-cron API:
        // https://github.com/kelektiv/node-cron#api
        cronTime: '0 0 * * *', // Everyday at midnight UTC
        start: true,
        // Note: the callbacks (onTick & onComplete) take the server
        // as an argument, as opposed to nothing in the node-cron API:
        onTick: async (server) => {
          console.log('Cron - Expired Order');
          // await fluctuateStockPrice(fastify);
          await updateExpiredOrder();
          console.log('Cron - Delete Old Stock Record');
          await deleteOldStockRecord();
        },
      },
    ],
  });
  next();
});
