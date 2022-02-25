const moment = require('moment');
const OrdersRepository = require('../dao/orders.dao');

const ordersService = (fastify) => {
  const {
    createNewOrder,
    getOrdersByUserIdDao,
    getAllOrdersDao,
    updateOrderDao,
    deleteOrderDao,
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
    return formatOrder(orders);
  };

  const getAllOrders = async () => {
    const orders = await getAllOrdersDao();
    return formatOrder(orders);
  };

  const formatOrder = (orders) => {
    return orders.map((orders) => ({
      ordersId: orders.order_id,
      ordersName: orders.order_name,
      amount: orders.amount,
      userId: orders.user_id,
      quantity: orders.quantity,
      fulfilledQuantity: orders.fulfilled_quantity,
      expiryDate: orders.expiry_date,
      orderType: orders.order_type,
      orderStatus: orders.order_status,
      tradeType: orders.tradeType,
      tickerName: orders.ticker_name,
      volume: orders.volume,
      dailyHigh: orders.daily_high,
      dailyLow: orders.daily_low,
      currentPrice: orders.current_price,
      initialPrice: orders.initial_price,
      stockId: orders.stock_id,
      stockName: orders.stock_name,
      tickerName: orders.ticker_name,
      volume: orders.volume,
      createdAt: moment(orders.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(orders.updated_at).format('DD/MM/YYYY'),
    }));
  };

  return {
    createOrder,
    getOrdersByUserId,
    getAllOrders,
    updateOrder,
    deleteOrder,
  };
};

module.exports = ordersService;