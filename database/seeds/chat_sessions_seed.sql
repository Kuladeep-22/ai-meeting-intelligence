-- ============================================================
-- CHAT SESSION SEED DATA
-- ============================================================

INSERT INTO chat_sessions
(
    user_id,
    title,
    created_at,
    updated_at,
    is_active
)
SELECT
    id,
    'Project Alpha Discussion',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    TRUE
FROM users
WHERE email = 'admin@example.com'
LIMIT 1;


INSERT INTO chat_sessions
(
    user_id,
    title,
    created_at,
    updated_at,
    is_active
)
SELECT
    id,
    'Weekly Meeting Chat',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    TRUE
FROM users
WHERE email = 'admin@example.com'
LIMIT 1;


INSERT INTO chat_sessions
(
    user_id,
    title,
    created_at,
    updated_at,
    is_active
)
SELECT
    id,
    'Decision Review',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    TRUE
FROM users
WHERE email = 'admin@example.com'
LIMIT 1;