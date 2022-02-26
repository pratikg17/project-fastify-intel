const MAX_PERCENT_CHANGE = 5;
const MIN_PERCENT_CHANGE = 1;

const percentChange = () => {
  // Random number to get the postive or negitive % change
  let plusOrMinus = Math.random() < 0.5 ? 1 : -1;

  // Will return a random number between the range
  let changePercent =
    Math.random() * (MAX_PERCENT_CHANGE - MIN_PERCENT_CHANGE) +
    MIN_PERCENT_CHANGE;
  return Math.round(Math.floor(plusOrMinus * changePercent));
};

const changeValueByPercent = (currentValue, percentChange) => {
  // $100 + ((-10%/100) * $100) = $90
  let changedValue = currentValue + (percentChange / 100) * currentValue;
  return changedValue;
};

const fakeStocks = (stocks) => {
  const change = percentChange();
  console.log('change', change + ' %');
  console.log(stocks);
  const newStockPrice = stocks.map((stock) => {
    const change = percentChange();
    let newCurrentPrice = changeValueByPercent(stock.current_price, change);
    let newVolume = changeValueByPercent(stock.volume, change);

    let dailyLow = stock.daily_low;
    let dailyHigh = stock.daily_high;

    if (newCurrentPrice <= dailyLow) {
      dailyLow = newCurrentPrice;
    }

    if (newCurrentPrice >= dailyHigh) {
      dailyHigh = newCurrentPrice;
    }

    console.log('Stock', stock.stock_name);
    console.log('Current Price', stock.current_price);
    console.log('New Price', newCurrentPrice);
    console.log('New dailyLow', dailyLow);
    console.log('New dailyHigh', dailyHigh);

    console.log('Vol', stock.current_price);
    console.log('New Vol', newVolume);
  });
};

module.exports = fakeStocks;
