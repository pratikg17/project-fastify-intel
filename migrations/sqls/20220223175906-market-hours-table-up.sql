DROP TABLE IF EXISTS market_hours;
CREATE TABLE market_hours (
 time_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 start_time TIME NOT NULL, 
 end_time TIME NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
