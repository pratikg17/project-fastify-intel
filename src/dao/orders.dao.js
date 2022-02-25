const dao = (db) => {
  const getOrdersDao = async (limit, offset) => {
    try {
      const orders = await db.query(
        `select * from orders o
        inner join stocks s on s.stock_id  = o.stock_id order by o.created_at limit $1 offset $2`,
        [limit, offset]
      );

      return orders;
    } catch (error) {
      throw Error('failed to fetch orders records from db');
    }
  };

  const getOrdersByUserIdDao = async (userId) => {
    try {
      const orders = await db.query(
        `select * from orders o
        inner join stocks s on s.stock_id  = o.stock_id  where user_id = $1 order by o.created_at`,
        [userId]
      );

      return orders;
    } catch (error) {
      throw Error('failed to fetch orders records from db');
    }
  };

  const deleteOrderDao = async (orderId) => {
    try {
      const orders = await db.query(
        `DELETE FROM public.orders
        WHERE order_id=$1 and order_status ='PLACED' returning *`,
        [orderId]
      );
      return orders;
    } catch (error) {
      console.log(error);
      throw Error('failed to delete order records from db');
    }
  };

  const getAllOrdersDao = async () => {
    try {
      const orders = await db.query(
        `select * from orders o inner join stocks s on s.stock_id  = o.stock_id `
      );

      return orders;
    } catch (error) {
      throw Error('failed to fetch orders records from db');
    }
  };

  const getAllTradeDao = async () => {
    try {
      const trades = await db.query(
        `select * from trades t 
        inner join stocks s on s.stock_id  = t.stock_id`
      );

      return trades;
    } catch (error) {
      throw Error('failed to fetch trades records from db');
    }
  };

  const getAllOrdersByUserIdDao = async (userId) => {
    try {
      const orders = await db.query(
        `select * from orders o inner join stocks s on s.stock_id  = o.stock_id  where userId=${userId}`
      );

      return orders;
    } catch (error) {
      throw Error('failed to fetch orders records from db');
    }
  };

  const getAllTradesByUserIdDao = async (userId) => {
    try {
      const trades = await db.query(
        `select * from trades t 
        inner join stocks s on s.stock_id  = t.stock_id where user_id = '${userId}'`
      );

      return trades;
    } catch (error) {
      throw Error('failed to fetch trades records from db');
    }
  };

  const createNewOrder = async (order) => {
    try {
      const orderData = await db.one(
        `INSERT INTO orders
        (user_id, stock_id, quantity, amount, order_type, trade_type, order_status, expiry_date)
        VALUES( $1, $2, $3, $4, $5, $6, 'PLACED', $7) RETURNING  *`,
        [
          order.userId,
          order.stockId,
          order.quantity,
          order.amount,
          order.orderType,
          order.tradeType,
          order.expiryDate,
        ]
      );
      return orderData;
    } catch (error) {
      console.log(error.message);
      throw Error('Not valid order data - failed to save in db');
    }
  };

  const updateOrderDao = async (order) => {
    try {
      //  Yearly High / Low , Daily High / Low and current price will be the same
      const { order_id } = await db.one(
        `UPDATE orders
        SET  fulfilled_quantity=$1, quantity=$2, amount=$3, "order_type"=$4,  expiry_date=$5, order_status = $6
        WHERE order_id= $7 RETURNING  *`,
        [
          order.fulfilledQuantity,
          order.quantity,
          order.amount,
          order.orderType,
          order.expiryDate,
          order.orderStatus,
          order.orderId,
        ]
      );
      return order_id;
    } catch (error) {
      console.log(error);
      throw Error('Not valid order data - failed to save in db');
    }
  };

  const recordNewTrade = async (trade) => {
    try {
      const tradeData = await db.one(
        `INSERT INTO trades
        (order_id, user_id, stock_id, quantity, buy_amount, sell_amount, "trade_type", trade_date)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning *`,
        [
          trade.orderId,
          trade.userId,
          trade.stockId,
          trade.quantity,
          trade.buy_amount,
          trade.sell_amount,
          trade.tradeType,
          trade.tradeDate,
        ]
      );
      return tradeData;
    } catch (error) {
      console.log(error.message);
      throw Error('Not valid trade data - failed to save in db');
    }
  };

  const getInvestorPortfolioDao = async (userId) => {
    try {
      const portfolioData = await db.query(
        `select distinct  s.stock_name  , sum(quantity) as "noOfStocks" , sum(buy_amount) / count(nullif(buy_amount, 0)) as  "avgBuyPrice" from trades t
        join stocks s on s.stock_id  = t.stock_id
        where user_id = $1
        group by  s.stock_name`,
        [userId]
      );
      return portfolioData;
    } catch (error) {
      console.log(error.message);
      throw Error('Not valid portfolio data - failed to get data from db');
    }
  };

  return {
    getAllOrdersDao,
    createNewOrder,
    updateOrderDao,
    getOrdersDao,
    getAllOrdersByUserIdDao,
    getOrdersByUserIdDao,
    getAllTradesByUserIdDao,
    getAllTradeDao,
    deleteOrderDao,
    recordNewTrade,
    getInvestorPortfolioDao,
  };
};

module.exports = dao;
