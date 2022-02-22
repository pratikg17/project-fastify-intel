DROP TABLE IF EXISTS stocks;
CREATE TABLE stocks (
 stock_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 stock_name TEXT NOT NULL ,
 ticker_name TEXT NOT NULL UNIQUE,
 volume REAL NOT NULL,
 initial_price REAL NOT NULL,
 daily_high REAL ,
 daily_low REAL ,
 current_price REAL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
