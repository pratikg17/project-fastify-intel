const moment = require('moment');
const OrdersRepository = require('../dao/orders.dao');

const ordersService = (fastify) => {
  const {
    createNewOrder,
    getOrdersByUserIdDao,
    getAllOrdersDao,
    updateOrderDao,
    deleteOrderDao,
    recordNewTrade,
    getAllTradesDao,
    getAllTradesByUserIdDao,
  } = OrdersRepository(fastify.db);

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

  return {
    createOrder,
    getOrdersByUserId,
    getAllOrders,
    updateOrder,
    deleteOrder,
    addNewTrade,
    getAllTrades,
    getTradesByUserId,
  };
};

module.exports = ordersService;

// select distinct  s.stock_name  , sum(quantity), sum(buy_amount) / count(nullif(buy_amount, 0))  from trades t
// join stocks s on s.stock_id  = t.stock_id
// where user_id = '0c489c87-1503-48f9-9dfb-3138d78e49d2'
// group by  s.stock_name
