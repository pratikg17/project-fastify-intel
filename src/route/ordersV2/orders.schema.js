const postRequestBody = {
  type: 'object',
  required: [
    'userId',
    'stockId',
    'quantity',
    'orderType',
    'tradeType',
    'expiryDate',
    'amount',
  ],
  properties: {
    stockId: {
      type: 'string',
    },
    userId: {
      type: 'string',
    },
    quantity: {
      type: 'number',
    },
    fulfilledQuantity: {
      type: 'number',
    },
    amount: {
      type: 'number',
    },
    orderType: {
      type: 'string',
    },
    tradeType: {
      type: 'string',
    },
    orderStatus: {
      type: 'string',
    },
    currentPrice: {
      type: 'number',
    },
    expiryDate: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
  },
};

const updateOrderRequestBody = {
  type: 'object',
  required: [
    'orderId',
    'quantity',
    'orderType',
    'tradeType',
    'expiryDate',
    'amount',
    'fulfilledQuantity',
    'orderStatus',
  ],
  properties: {
    orderId: {
      type: 'string',
    },
    stockId: {
      type: 'string',
    },
    userId: {
      type: 'string',
    },
    quantity: {
      type: 'number',
    },
    fulfilledQuantity: {
      type: 'number',
    },
    amount: {
      type: 'number',
    },
    orderType: {
      type: 'string',
    },
    tradeType: {
      type: 'string',
    },
    orderStatus: {
      type: 'string',
    },
    currentPrice: {
      type: 'number',
    },
    expiryDate: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
  },
};

const queryParameter = {
  type: 'object',
  required: ['limit', 'offset'],
  properties: {
    limit: {
      type: 'number',
    },
    offset: {
      type: 'number',
    },
  },
};

const queryParameterUserId = {
  type: 'object',
  required: ['user_id'],
  properties: {
    limit: {
      type: 'number',
    },
    offset: {
      type: 'number',
    },
    user_id: {
      type: 'string',
    },
  },
};

const deleteOrderReqObj = {
  type: 'object',
  required: ['orderId'],
  properties: {
    orderId: {
      type: 'string',
    },
  },
};

const addTradeReqObj = {
  type: 'object',
  required: [
    'orderId',
    'userId',
    'stockId',
    'quantity',
    'tradeType',
    'buy_amount',
    'sell_amount',
  ],
  properties: {
    orderId: {
      type: 'string',
    },
    stockId: {
      type: 'string',
    },
    userId: {
      type: 'string',
    },
    quantity: {
      type: 'number',
    },
    buy_amount: {
      type: 'number',
    },
    sell_amount: {
      type: 'number',
    },
    tradeType: {
      type: 'string',
    },
    tradeDate: {
      type: 'string',
    },
  },
};

module.exports = {
  postRequestBody,
  queryParameter,
  queryParameterUserId,
  addTradeReqObj,
};

// select distinct  s.stock_name  , sum(quantity), avg(amount)  from trades t
// join stocks s on s.stock_id  = t.stock_id
// where user_id = '0c489c87-1503-48f9-9dfb-3138d78e49d2'
// group by  s.stock_name
