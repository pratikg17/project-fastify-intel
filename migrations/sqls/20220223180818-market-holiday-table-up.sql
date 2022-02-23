DROP TABLE IF EXISTS market_holidays;
CREATE TABLE market_holidays (
 holiday_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 holiday_date DATE  NOT NULL, 
 holiday_name TEXT NOT NULL,
 holiday_type HOLIDAY_TYPE NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
