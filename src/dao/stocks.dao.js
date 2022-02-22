const dao = (db) => {
  const getAllStocks = async (limit, offset) => {
    try {
      const stocks = await db.query(
        `select * from stocks order by created_at limit $1 offset $2`,
        [limit, offset]
      );

      return stocks;
    } catch (error) {
      throw Error('failed to fetch stocks records from db');
    }
  };

  const createNewStock = async (stock) => {
    try {
      //  Yearly High / Low , Daily High / Low and current price will be the same
      const { stock_id } = await db.one(
        `INSERT INTO stocks (stock_name, ticker_name, volume, initial_price, daily_high, daily_low, current_price ) 
        VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING stock_id`,
        [
          stock.stockName,
          stock.tickerName,
          stock.volume,
          stock.initialPrice,
          stock.initialPrice,
          stock.initialPrice,
          stock.initialPrice,
        ]
      );
      return stock_id;
    } catch (error) {
      console.log(error.message);
      throw Error('Not valid stock data - failed to save in db');
    }
  };

  const updateStock = async (stock) => {
    try {
      //  Yearly High / Low , Daily High / Low and current price will be the same
      const stockUpdated = await db.one(
        `UPDATE stocks
        SET ticker_name= $1, stock_name=$2, volume=$3, initial_price=$4, daily_high=$5, daily_low=$5, current_price=$6
        WHERE stock_id =$7`,
        [
          stock.tickerName,
          stock.stockName,
          stock.volume,
          stock.initialPrice,
          stock.dailyHigh,
          stock.dailyLow,
          stock.currentPrice,
          stock.stock_id,
        ]
      );
      return stockUpdated;
    } catch (error) {
      console.log(error.message);
      throw Error('Not valid stock data - failed to save in db');
    }
  };

  return {
    getAllStocks,
    createNewStock,
    updateStock,
  };
};

module.exports = dao;