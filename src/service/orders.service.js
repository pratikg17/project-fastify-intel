const moment = require('moment');
const OrdersRepository = require('../dao/orders.dao');
const StockRepository = require('../dao/stocks.dao');
const UserRepository = require('../dao/users.dao');
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
  const {
    getInvestorFundBalanceDao,
    creditInvestorFundsForTradeDao,
    debitInvestorFundsForTradeDao,
  } = UserRepository(fastify.db);

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

      // executeOrders();
      return executeOrders();
    }

    return false;
  };

  const executeOrders = async () => {
    const allStocks = await getAllStocksDao();

    const stockPriceMap = {};
    allStocks.forEach((stock) => {
      stockPriceMap[stock.stock_id] = stock;
    });

    const allPlacedOrders = await getAllPlacedOrdersDao();
    const buyOrders = allPlacedOrders.filter(
      (order) => order.trade_type == 'BUY'
    );
    const sellOrders = allPlacedOrders.filter(
      (order) => order.trade_type == 'SELL'
    );

    let trades = [];

    for (let i = 0; i < buyOrders.length; i++) {
      buyOrders[i] = parseOrders(buyOrders[i]);

      if (buyOrders[i].fulfilled_quantity != buyOrders[i].quantity) {
        for (let j = 0; j < sellOrders.length; j++) {
          sellOrders[j] = parseOrders(sellOrders[j]);
          if (
            buyOrders[i].stock_id == sellOrders[j].stock_id &&
            sellOrders[j].order_status != 'EXECUTED' &&
            buyOrders[i].user_id != sellOrders[j].user_id
          ) {
            let buyOrderFulFilled =
              buyOrders[i].quantity - buyOrders[i].fulfilled_quantity;
            let sellOrderFulFilled =
              sellOrders[j].quantity - sellOrders[j].fulfilled_quantity;
            console.log('buyOrderFulFilled', buyOrderFulFilled);
            console.log('sellOrderFulFilled', sellOrderFulFilled);

            let tradingStock = stockPriceMap[buyOrders[i].stock_id];
            let stockPrice = parseFloat(tradingStock.current_price);

            if (
              buyOrders[i].order_type == 'LIMIT' &&
              sellOrders[j].order_type == 'LIMIT' &&
              sellOrders[j].amount === buyOrders[i].amount
            ) {
              stockPrice = buyOrders[i].amount;
              orderType = 'LIMIT';
            } else {
              if (buyOrderFulFilled == sellOrderFulFilled) {
                // Buy and Sell order complete
                if (
                  buyOrders[i].order_type == 'MARKET' &&
                  sellOrders[j].order_type == 'MARKET'
                ) {
                  //  Get Buyer Wallet
                  let buyerWallet = await getInvestorFundBalanceDao(
                    buyOrders[i].user_id
                  );

                  let buyerDebitAmount = stockPrice * sellOrderFulFilled;
                  if (buyerWallet >= stockPrice * sellOrderFulFilled) {
                    buyOrders[i].fulfilled_quantity += sellOrderFulFilled;
                    sellOrders[j].fulfilled_quantity += buyOrderFulFilled;
                    buyOrders[i].order_status = 'EXECUTED';
                    sellOrders[j].order_status = 'EXECUTED';

                    let buyTrade = {
                      stockId: buyOrders[i].stock_id,
                      orderId: buyOrders[i].order_id,
                      userId: buyOrders[i].user_id,
                      quantity: buyOrderFulFilled,
                      buyAmount: stockPrice,
                      sellAmount: 0,
                      tradeType: 'BUY',
                      tradeDate: moment().toISOString(),
                    };

                    let sellTrade = {
                      stockId: sellOrders[j].stock_id,
                      orderId: sellOrders[j].order_id,
                      userId: sellOrders[j].user_id,
                      quantity: sellOrderFulFilled,
                      buyAmount: 0,
                      sellAmount: stockPrice,
                      tradeType: 'SELL',
                      tradeDate: moment().toISOString(),
                    };

                    let buyerDebit = {
                      debitAmount: buyerDebitAmount,
                      creditAmount: 0,
                      userId: buyOrders[i].user_id,
                      description: `Bought ${sellOrderFulFilled} stocks of ${tradingStock.stock_name} for ${stockPrice}`,
                    };

                    let sellerCredit = {
                      debitAmount: 0,
                      creditAmount: buyerDebitAmount,
                      userId: sellOrders[j].user_id,
                      description: `Sold ${sellOrderFulFilled} stocks of ${tradingStock.stock_name} at ${stockPrice}`,
                    };

                    trades.push(buyTrade);
                    trades.push(sellTrade);
                    await debitInvestorFundsForTradeDao(buyerDebit);
                    await creditInvestorFundsForTradeDao(sellerCredit);
                    await addNewTrade(buyTrade);
                    await addNewTrade(sellTrade);
                  } else {
                    buyOrders[i].orderStatus = 'INSUFFICIENT_BALANCE';
                  }
                }
              } else if (buyOrderFulFilled > sellOrderFulFilled) {
                // Sell order complete
                //  Get Buyer Wallet
                let buyerWallet = await getInvestorFundBalanceDao(
                  buyOrders[i].user_id
                );

                let buyerDebitAmount = stockPrice * sellOrderFulFilled;
                if (buyerWallet >= buyerDebitAmount) {
                  sellOrders[j].fulfilled_quantity += sellOrderFulFilled;
                  buyOrders[i].fulfilled_quantity += sellOrderFulFilled;
                  buyOrders[i].order_status = 'PARTIALLY_EXECUTED';
                  sellOrders[j].order_status = 'EXECUTED';

                  let buyTrade = {
                    stockId: buyOrders[i].stock_id,
                    orderId: buyOrders[i].order_id,
                    userId: buyOrders[i].user_id,
                    quantity: sellOrderFulFilled,
                    buyAmount: stockPrice,
                    sellAmount: 0,
                    tradeType: 'BUY',
                    tradeDate: moment().toISOString(),
                  };

                  let sellTrade = {
                    stockId: sellOrders[j].stock_id,
                    orderId: sellOrders[j].order_id,
                    userId: sellOrders[j].user_id,
                    quantity: sellOrderFulFilled,
                    buyAmount: 0,
                    sellAmount: stockPrice,
                    tradeType: 'SELL',
                    tradeDate: moment().toISOString(),
                  };

                  let buyerDebit = {
                    debitAmount: buyerDebitAmount,
                    creditAmount: 0,
                    userId: buyOrders[i].user_id,
                    description: `Bought ${buyOrders[i].fulfilled_quantity} stocks of ${tradingStock.stock_name} for ${stockPrice}`,
                  };

                  let sellerCredit = {
                    debitAmount: 0,
                    creditAmount: buyerDebitAmount,
                    userId: sellOrders[j].user_id,
                    description: `Sold ${sellOrders[j].fulfilled_quantity} stocks of ${tradingStock.stock_name} at ${stockPrice}`,
                  };

                  trades.push(buyTrade);
                  trades.push(sellTrade);
                  await debitInvestorFundsForTradeDao(buyerDebit);
                  await creditInvestorFundsForTradeDao(sellerCredit);
                  await addNewTrade(buyTrade);
                  await addNewTrade(sellTrade);
                } else {
                  buyOrders[i].orderStatus = 'INSUFFICIENT_BALANCE';
                }
              } else {
                //  Get Buyer Wallet
                let buyerWallet = await getInvestorFundBalanceDao(
                  buyOrders[i].user_id
                );

                let buyerDebitAmount = stockPrice * buyOrderFulFilled;
                console.log('buyerDebitAmount', buyerDebitAmount);
                if (buyerWallet >= buyerDebitAmount) {
                  //Buy order complete
                  buyOrders[i].fulfilled_quantity += buyOrderFulFilled;
                  sellOrders[j].fulfilled_quantity += buyOrderFulFilled;
                  buyOrders[i].order_status = 'EXECUTED';
                  sellOrders[j].order_status = 'PARTIALLY_EXECUTED';
                  let buyTrade = {
                    stockId: buyOrders[i].stock_id,
                    orderId: buyOrders[i].order_id,
                    userId: buyOrders[i].user_id,
                    quantity: buyOrderFulFilled,
                    buyAmount: stockPrice,
                    sellAmount: 0,
                    tradeType: 'BUY',
                    tradeDate: moment().toISOString(),
                  };
                  let sellTrade = {
                    stockId: sellOrders[j].stock_id,
                    orderId: sellOrders[j].order_id,
                    userId: sellOrders[j].user_id,
                    quantity: buyOrderFulFilled,
                    buyAmount: 0,
                    sellAmount: stockPrice,
                    tradeType: 'SELL',
                    tradeDate: moment().toISOString(),
                  };

                  let buyerDebit = {
                    debitAmount: buyerDebitAmount,
                    creditAmount: 0,
                    userId: buyOrders[i].user_id,
                    description: `Bought ${buyOrders[i].fulfilled_quantity} stocks of ${tradingStock.stock_name} for ${stockPrice}`,
                  };

                  let sellerCredit = {
                    debitAmount: 0,
                    creditAmount: buyerDebitAmount,
                    userId: sellOrders[j].user_id,
                    description: `Sold ${sellOrders[j].fulfilled_quantity} stocks of ${tradingStock.stock_name} at ${stockPrice}`,
                  };

                  trades.push(buyTrade);
                  trades.push(sellTrade);
                  await debitInvestorFundsForTradeDao(buyerDebit);
                  await creditInvestorFundsForTradeDao(sellerCredit);
                  await addNewTrade(buyTrade);
                  await addNewTrade(sellTrade);
                } else {
                  buyOrders[i].orderStatus = 'INSUFFICIENT_BALANCE';
                }
              }
            }
          }
        }
      }
    }

    console.log('BUY ORDER', buyOrders);
    console.log('SELL ORDER', sellOrders);

    return {
      trades,
      buyOrders,
      sellOrders,
    };
    // BUY MARKET = Search stock_id in sell order
    // 1. See if the quantity matches if matches
    // 2. Add both the orders in executionArray
    // 3. Check whether buyer has enough funds (based on funds )
    // 4. Add deduct the amount for buyer
    // 5. Credit amount for seller
    // 6. Add the trades for Buyer and seller
  };

  const parseOrders = (order) => {
    let quantity = parseInt(order.quantity);
    let fulfilled_quantity = parseInt(order.fulfilled_quantity);

    return {
      ...order,
      quantity,
      fulfilled_quantity,
    };
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
