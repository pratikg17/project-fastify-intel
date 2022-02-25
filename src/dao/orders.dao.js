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

  return {
    getAllOrdersDao,
    createNewOrder,
    updateOrderDao,
    getOrdersDao,
    getAllOrdersByUserIdDao,
    getOrdersByUserIdDao,
    deleteOrderDao,
  };
};

module.exports = dao;