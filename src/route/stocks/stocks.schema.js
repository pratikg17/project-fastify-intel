const postRequestBody = {
  type: 'object',
  required: ['stockName', 'tickerName', 'volume', 'initialPrice'],
  properties: {
    stockId: {
      type: 'string',
    },
    stockName: {
      type: 'string',
    },
    tickerName: {
      type: 'string',
    },
    volume: {
      type: 'number',
    },
    initialPrice: {
      type: 'number',
    },
    currentPrice: {
      type: 'number',
    },
    dailyHigh: {
      type: 'number',
    },
    dailyLow: {
      type: 'number',
    },
    openPrice: {
      type: 'number',
    },
    closePrice: {
      type: 'number',
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
