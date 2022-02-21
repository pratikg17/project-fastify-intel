INSERT INTO roles
(role_id, "name", description, "type", created_at, updated_at)
VALUES(gen_random_uuid(), 'admin', 'admin role', 'ADMIN', now(), now()), (gen_random_uuid(), 'investor', 'investor  role', 'INVESTOR', now(), now());

