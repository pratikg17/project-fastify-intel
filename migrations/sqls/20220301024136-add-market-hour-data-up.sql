truncate table market_hours ;
INSERT INTO market_hours
(time_id, start_time, end_time, created_at, updated_at)
VALUES(gen_random_uuid(), '01:00:00', '23:00:00', now(), now());