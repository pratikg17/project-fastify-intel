const moment = require('moment');
const OrdersRepository = require('../dao/orders.dao');

const ordersService = (fastify) => {
  const { createNewOrder, getOrdersDao, getAllOrdersDao, updateOrderDao } =
    OrdersRepository(fastify.db);

  const createOrder = async (orders) => {
    const orderId = await createNewOrder(orders);
    return orderId;
  };

  const updateOrder = async (orders) => {
    const ordersId = await updateOrderDao(orders);
    return ordersId;
  };

  const getOrders = async (limit, offset) => {
    const orders = await getOrdersDao(limit, offset);

    return orders.map((orders) => ({
      ordersId: orders.orders_id,
      ordersName: orders.orders_name,
      tickerName: orders.ticker_name,
      volume: orders.volume,
      dailyHigh: orders.daily_high,
      dailyLow: orders.daily_low,
      currentPrice: orders.current_price,
      initialPrice: orders.initial_price,
      createdAt: moment(orders.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(orders.updated_at).format('DD/MM/YYYY'),
    }));
  };

  const getAllOrders = async () => {
    const orders = await getAllOrdersDao();

    return orders.map((orders) => ({
      ordersId: orders.orders_id,
      ordersName: orders.orders_name,
      tickerName: orders.ticker_name,
      volume: orders.volume,
      dailyHigh: orders.daily_high,
      dailyLow: orders.daily_low,
      currentPrice: orders.current_price,
      initialPrice: orders.initial_price,
      createdAt: moment(orders.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(orders.updated_at).format('DD/MM/YYYY'),
    }));
  };

  return { createOrder, getOrders, getAllOrders, updateOrder };
};

module.exports = ordersService;
