const recordStockPriceHelper = (
  stocks,
  isMarketStartTime,
  isMarketEndTime,
  timestamp
) => {
  let recordType = 'FIVE_MINUTE';

  if (isMarketStartTime) {
    recordType = 'OPEN';
  }

  if (isMarketEndTime) {
    recordType = 'CLOSE';
  }

  console.log('MINUTE', timestamp.minute());

  const isSaveRecords = timestamp.minute() % 5 == 0 ? true : false;
  // const isSaveRecords = true;

  if (isSaveRecords) {
    const queryString = stocks.map((stock) => {
      return `('${stock.stock_id}', ${stock.newCurrentPrice}, ${
        stock.newVolume
      }, '${recordType}', '${timestamp.toISOString()}', '${timestamp.toISOString()}')`;
    });

    const query = `INSERT INTO public.stock_price_records
      (stock_id, price, volume, record_type, record_time, record_date)
      VALUES  ${queryString} `;

    return query;
  } else {
    return null;
  }
};

module.exports = recordStockPriceHelper;
