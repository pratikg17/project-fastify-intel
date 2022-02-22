const moment = require('moment');
const StockRepository = require('../dao/stocks.dao');

const stockService = (fastify) => {
  const { createNewStock, getAllStocks } = StockRepository(fastify.db);

  const createStock = async (stock) => {
    const stockId = await createNewStock(stock);
    return stockId;
  };

  const getStocks = async (limit, offset) => {
    const stocks = await getAllStocks(limit, offset);

    return stocks.map((stock) => ({
      stockId: stock.stock_id,
      stockName: stock.stock_name,
      tickerName: stock.ticker_name,
      volume: stock.volume,
      dailyHigh: stock.daily_high,
      dailyLow: stock.daily_low,
      currentPrice: stock.current_price,
      initialPrice: stock.initial_price,
      createdAt: moment(stock.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(stock.updated_at).format('DD/MM/YYYY'),
    }));
  };

  return { createStock, getStocks };
};

module.exports = stockService;
