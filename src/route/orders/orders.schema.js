const postRequestBody = {
  type: 'object',
  required: [
    'userId',
    'stockId',
    'quantity',
    'orderType',
    'tradeType',
    'exipryDate',
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

module.exports = {
  postRequestBody,
  queryParameter,
};
