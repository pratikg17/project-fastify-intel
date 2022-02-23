DROP TABLE IF EXISTS stock_price_records;
CREATE TABLE stock_price_records (
 record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 stock_id UUID NOT NULL, 
 price REAL NOT NULL,
 volume REAL NOT NULL,
 record_type TRADE_TYPE NOT NULL,
 record_time timestamptz,
 record_date DATE NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT fk_record_stocks FOREIGN KEY(stock_id) REFERENCES stocks(stock_id)
);
