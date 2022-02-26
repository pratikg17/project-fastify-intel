const dao = (db) => {
  const getStocksDao = async (limit, offset) => {
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

  const getAllStocksDao = async () => {
    try {
      const stocks = await db.query(`select * from stocks`);

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

  const updateStockDao = async (stock) => {
    try {
      //  Yearly High / Low , Daily High / Low and current price will be the same
      const stockUpdated = await db.one(
        `UPDATE stocks
        SET ticker_name= $1, stock_name=$2, volume=$3, initial_price=$4
        WHERE stock_id =$5 RETURNING *`,
        [
          stock.tickerName,
          stock.stockName,
          stock.volume,
          stock.initialPrice,
          stock.stockId,
        ]
      );
      return stockUpdated;
    } catch (error) {
      console.log(error);
      throw Error('Not valid stock data - failed to save in db');
    }
  };

  const updateStockPricesDao = async (stockPrices) => {
    try {
      //  Yearly High / Low , Daily High / Low and current price will be the same

      const updateValues = stockPrices.map((stock) => {
        let values = `('${stock.stockId}'::uuid, ${stock.currentPrice}, ${stock.volume}, ${stock.dailyHigh}, ${stock.dailyLow})`;
        return values;
      });
      const query = `update stocks
      set
        current_price = tmp.current_price,
        volume = tmp.volume ,
        daily_high = tmp.daily_high ,
        daily_low = tmp.daily_low
      from ( values  ${updateValues.join(',')}) 
      as tmp (stock_id , current_price, volume, daily_high, daily_low)
      where
        stocks.stock_id = tmp.stock_id ;`;

      const stockUpdated = await db.query(query);
      return stockUpdated;
    } catch (error) {
      console.log(error);
      throw Error('Not valid stock data - failed to update in db');
    }
  };

  return {
    getAllStocksDao,
    createNewStock,
    updateStockDao,
    getStocksDao,
    updateStockPricesDao,
  };
};

module.exports = dao;
