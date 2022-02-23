const dao = (db) => {
  const getOrdersDao = async (limit, offset) => {
    try {
      const orders = await db.query(
        `select * from orders order by created_at limit $1 offset $2`,
        [limit, offset]
      );

      return orders;
    } catch (error) {
      throw Error('failed to fetch orders records from db');
    }
  };

  const getOrdersByUserIdDao = async (limit, offset, userId) => {
    try {
      const orders = await db.query(
        `select * from orders  where user_id = $1 order by created_at limit $2 offset $3`,
        [userId, limit, offset]
      );

      return orders;
    } catch (error) {
      throw Error('failed to fetch orders records from db');
    }
  };

  const getAllOrdersDao = async () => {
    try {
      const orders = await db.query(`select * from orders`);

      return orders;
    } catch (error) {
      throw Error('failed to fetch orders records from db');
    }
  };

  const getAllOrdersByUserIdDao = async (userId) => {
    try {
      const orders = await db.query(
        `select * from orders where userId=${userId}`
      );

      return orders;
    } catch (error) {
      throw Error('failed to fetch orders records from db');
    }
  };

  const createNewOrder = async (order) => {
    try {
      const order = await db.one(
        `INSERT INTO orders
        (user_id, stock_id, quantity, amount, order_type, trade_type, order_status, expiry_date)
        VALUES( $1, $2, $3, $4, $5, $6', 'PLACED', $7) RETURNING  *`,
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
      return order_id;
    } catch (error) {
      console.log(error.message);
      throw Error('Not valid order data - failed to save in db');
    }
  };

  const updateOrderDao = async (order) => {
    try {
      //  Yearly High / Low , Daily High / Low and current price will be the same
      const orderUpdated = await db.one(
        `UPDATE orders
        SET  fulfilled_quantity=$1, quantity=$2, amount=$3, "order_type"=$4,  expiry_date=$5, order_status = $6
        WHERE order_id= '7cbcc31b-2b29-4c13-bcdc-fc00774d049e' RETURNING  *`,
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
      return orderUpdated;
    } catch (error) {
      console.log(error);
      throw Error('Not valid order data - failed to save in db');
    }
  };

  return {
    getAllOrdersDao,
    createNewOrder,
    updateOrderDao,
    getOrdersDao,
    getAllOrdersByUserIdDao,
    getOrdersByUserIdDao,
  };
};

module.exports = dao;
