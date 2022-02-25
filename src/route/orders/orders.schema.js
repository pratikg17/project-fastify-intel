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

const queryParameterOrders = {
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

module.exports = {
  postRequestBody,
  queryParameter,
  queryParameterOrders,
};
