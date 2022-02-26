const moment = require('moment');
const OrdersRepository = require('../dao/orders.dao');
const StockRepository = require('../dao/stocks.dao');
const fakeStocks = require('../plugin/helper/fakerStockPrices');

const ordersService = (fastify) => {
  const {
    createNewOrder,
    getOrdersByUserIdDao,
    getAllOrdersDao,
    updateOrderDao,
    deleteOrderDao,
    recordNewTrade,
    getAllTradesByUserIdDao,
    getInvestorPortfolioDao,
    getMarketHoursDao,
    getAllPlacedOrdersDao,
  } = OrdersRepository(fastify.db);

  const { getAllStocksDao, updateStockPricesDao, recordStockPriceDao } =
    StockRepository(fastify.db);

  const createOrder = async (orders) => {
    const orderId = await createNewOrder(orders);
    return orderId;
  };

  const updateOrder = async (orders) => {
    const ordersId = await updateOrderDao(orders);
    return ordersId;
  };

  const deleteOrder = async (orders) => {
    const ordersId = await deleteOrderDao(orders);
    return ordersId;
  };

  const getOrdersByUserId = async (userId) => {
    const orders = await getOrdersByUserIdDao(userId);
    return format(orders);
  };

  const getAllOrders = async () => {
    const orders = await getAllOrdersDao();
    return format(orders);
  };

  const getTradesByUserId = async (userId) => {
    const trades = await getAllTradesByUserIdDao(userId);
    return format(trades);
  };

  const getAllTrades = async () => {
    const trades = await getAllTradesDao();
    return format(trades);
  };

  const format = (res) => {
    return res.map((data) => ({
      ordersId: data.order_id,
      ordersName: data.order_name,
      amount: data.amount,
      userId: data.user_id,
      quantity: data.quantity,
      fulfilledQuantity: data.fulfilled_quantity,
      expiryDate: data.expiry_date,
      orderType: data.order_type,
      orderStatus: data.order_status,
      tradeType: data.tradeType,
      tickerName: data.ticker_name,
      volume: data.volume,
      dailyHigh: data.daily_high,
      dailyLow: data.daily_low,
      currentPrice: data.current_price,
      initialPrice: data.initial_price,
      stockId: data.stock_id,
      stockName: data.stock_name,
      tickerName: data.ticker_name,
      volume: data.volume,
      tradeId: data.trade_id,
      buyAmount: data.buy_amount,
      sellAmount: data.sell_amount,
      tradeDate: moment(data.trade_date).format('MMMM Do YYYY, h:mm:ss a'),
      createdAt: moment(data.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(data.updated_at).format('DD/MM/YYYY'),
    }));
  };

  const addNewTrade = async (trade) => {
    const tradeData = await recordNewTrade(trade);
    return {
      tradeId: tradeData.trade_id,
      orderId: tradeData.order_id,
      userId: tradeData.user_id,
      stockId: tradeData.stock_id,
      quantity: tradeData.quantity,
      amount: tradeData.amount,
      tradeType: tradeData.trade_type,
      tradeDate: moment(tradeData.trade_date).format('MMMM Do YYYY, h:mm:ss a'),
      createdAt: moment(tradeData.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(tradeData.updated_at).format('DD/MM/YYYY'),
    };
  };

  const getInvestorPortfolio = async (userId) => {
    const portfolioData = await getInvestorPortfolioDao(userId);
    return portfolioData;
  };

  const fluctuateStockPrice = async () => {
    console.log('Called fluctuateStockPrice');
    const marketHours = await getMarketHoursDao();

    const startTime = moment(marketHours.start_time, 'HH:mm:ss');
    const endTime = moment(marketHours.end_time, 'HH:mm:ss');
    let timestamp = moment();

    const currentMarketTime = moment(timestamp, 'HH:mm:ss');
    let isMarketStartTime =
      currentMarketTime.format('hh:mm A') == startTime.format('hh:mm A');
    let isMarketEndTime =
      currentMarketTime.format('hh:mm A') == endTime.format('hh:mm A');

    console.log('startTime', startTime);
    console.log('endTime', endTime);
    console.log('currentMarketTime', currentMarketTime);
    console.log('isMarketStartTime', isMarketStartTime);
    console.log('isMarketEndTime', isMarketEndTime);

    // TODO Change this
    const isWeekEnd = timestamp.day() % 6 == 0;

    console.log('isWeekEnd', isWeekEnd);

    console.log(
      'TIME IS BEWTEEN',
      timestamp.isBetween(startTime, endTime.add(1, 'm'))
    );

    // If a weekday and between the
    if (isWeekEnd && timestamp.isBetween(startTime, endTime.add(1, 'm'))) {
      const allStocks = await getAllStocksDao();
      const newStockPrices = fakeStocks(allStocks);

      // Update Stock prices
      const formatStockUpdateData = newStockPrices.map((stock) => {
        return {
          stockId: stock.stock_id,
          currentPrice: stock.newCurrentPrice,
          volume: stock.newVolume,
          dailyHigh: stock.dailyHigh,
          dailyLow: stock.dailyLow,
        };
      });

      await updateStockPricesDao(formatStockUpdateData);

      // Record Stock Prices
      await recordStockPriceDao(
        newStockPrices,
        isMarketStartTime,
        isMarketEndTime,
        timestamp
      );

      executeOrders();
      return true;
    }

    return false;
  };

  const executeOrders = async () => {
    const allStocks = await getAllStocksDao();
    const allPlacedOrders = await getAllPlacedOrdersDao();
    const buyOrder = allPlacedOrders.filter(
      (order) => order.trade_type == 'BUY' && order.order_type == 'MARKET'
    );
    const sellOrder = allPlacedOrders.filter(
      (order) => order.trade_type == 'SELL' && order.order_type == 'MARKET'
    );

    console.log('BUY ORDER', buyOrder);
    console.log('sellOrder', sellOrder);
    // BUY MARKET = Search stock_id in sell order
    // 1. See if the quantity matches if matches
    // 2. Add both the orders in executionArray
    // 3. Check whether buyer has enough funds (based on funds )
    // 4. Add deduct the amount for buyer
    // 5. Credit amount for seller
    // 6. Add the trades for Buyer and seller
  };

  return {
    createOrder,
    getOrdersByUserId,
    getAllOrders,
    updateOrder,
    deleteOrder,
    addNewTrade,
    getAllTrades,
    getTradesByUserId,
    getInvestorPortfolio,
    fluctuateStockPrice,
    executeOrders,
  };
};

module.exports = ordersService;
