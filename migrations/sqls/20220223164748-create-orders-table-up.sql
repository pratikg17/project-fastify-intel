DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
 order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL,
 stock_id UUID NOT NULL, 
 fulfilled_quantity BIGINT NOT NULL DEFAULT 0,
 quantity BIGINT NOT NULL,
 amount REAL NOT NULL,
 order_type ORDER_TYPE NOT NULL,
 trade_type TRADE_TYPE NOT NULL,
 order_status ORDER_STATUS_TYPE NOT NULL,
 expiry_date timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT fk_orders_users FOREIGN KEY(user_id) REFERENCES users(user_id),
 CONSTRAINT fk_orders_stocks FOREIGN KEY(stock_id) REFERENCES stocks(stock_id)
);
