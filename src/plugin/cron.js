const fp = require('fastify-plugin');
const fastifyCron = require('fastify-cron');
const OrderService = require('../service/orders.service');
module.exports = fp(async (fastify, options, next) => {
  const { fluctuateStockPrice } = OrderService(fastify);

  fastify.register(fastifyCron, {
    jobs: [
      {
        // Only these two properties are required,
        // the rest is from the node-cron API:
        // https://github.com/kelektiv/node-cron#api
        cronTime: '* * * * *', // Everyday at midnight UTC
        start: true,
        // Note: the callbacks (onTick & onComplete) take the server
        // as an argument, as opposed to nothing in the node-cron API:
        onTick: async (server) => {
          console.log('Cronjob- start');
          await fluctuateStockPrice(fastify);
          // console.log(server);

          // 1.Check if market is open or not
          // 2.Check if its holiday or not
          // 3.Get the stocks
          // 4.Create a function which will modify the price and volume
          // 5.update all the stock price
          // 6.If it is the 5th minute store the data in record table
          // const isMarketOpen = await fluctuateStockPrice();

          // if (isMarketOpen) {
          //   executeOrders();
          // }

          // 7. Get the new stock prices and get the orders Execute the buy / sell orders
          // 8.Get the user details and wallet
          // 9.check if there is sufficent funds if not then reject the order insufficent funds
          // 10. Update the order to executed if there is match for the stock
          // 11. If buy then deduct the wallet
          // 12. If sell order credit the wallet
          // 13. Add the Trades
        },
      },
    ],
  });
  next();
});
