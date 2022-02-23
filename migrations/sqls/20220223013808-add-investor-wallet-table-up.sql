DROP TABLE IF EXISTS investor_funds;
CREATE TABLE investor_funds (
 trasactionId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 debit_amount REAL NOT NULL ,
 credit_amount REAL NOT NULL,
 description TEXT,
 user_id UUID NOT NULL,
 transaction_type TRANSACTION_TYPE NOT NULL,
 trasactionDate timestamptz NOT NULL DEFAULT now() ,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT fk_users_investor_funds FOREIGN KEY(user_id) REFERENCES users(user_id)
);
