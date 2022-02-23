DROP TABLE IF EXISTS trades;
CREATE TABLE trades (
 trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 order_id UUID NOT NULL,
 user_id UUID NOT NULL,
 stock_id UUID NOT NULL, 
 quantity BIGINT NOT NULL,
 amount REAL NOT NULL,
 trade_type TRADE_TYPE NOT NULL,
 order_status ORDER_STATUS_TYPE NOT NULL,
 trade_date timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT fk_trades_users FOREIGN KEY(user_id) REFERENCES users(user_id),
 CONSTRAINT fk_trades_stocks FOREIGN KEY(stock_id) REFERENCES stocks(stock_id),
 CONSTRAINT fk_trades_orders FOREIGN KEY(order_id) REFERENCES orders(order_id)
);
