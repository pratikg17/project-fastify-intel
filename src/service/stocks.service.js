const moment = require('moment');
const StockRepository = require('../dao/stocks.dao');

const stockService = (fastify) => {
  const { createNewStock, getStocksDao, getAllStocksDao, updateStockDao } =
    StockRepository(fastify.db);

  const createStock = async (stock) => {
    const stockId = await createNewStock(stock);
    return stockId;
  };

  const updateStock = async (stock) => {
    const stockId = await updateStockDao(stock);
    return stockId;
  };

  const getStocks = async (limit, offset) => {
    const stocks = await getStocksDao(limit, offset);

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

  const getAllStocks = async () => {
    const stocks = await getAllStocksDao();

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

  return { createStock, getStocks, getAllStocks, updateStock };
};

module.exports = stockService;
