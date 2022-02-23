DROP TABLE IF EXISTS market_hours;
CREATE TABLE market_hours (
 time_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 start_time UUID NOT NULL, 
 end_time REAL NOT NULL,
 volume REAL NOT NULL,
 record_type TRADE_TYPE NOT NULL,
 record_time timestamptz,
 record_date DATE NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
