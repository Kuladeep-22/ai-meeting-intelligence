-- ============================================================
-- CHAT MESSAGE SEED DATA
-- ============================================================


-- ------------------------------------------------------------
-- Project Alpha Discussion
-- ------------------------------------------------------------

INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'user',
    'What decisions were made about Project Alpha?',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM chat_sessions
WHERE title = 'Project Alpha Discussion'
ORDER BY id
LIMIT 1;


INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'assistant',
    'The team decided to move the Project Alpha release to October and complete the remaining testing before deployment.',
    CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '1 minute'
FROM chat_sessions
WHERE title = 'Project Alpha Discussion'
ORDER BY id
LIMIT 1;


INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'user',
    'Who was responsible for completing the testing?',
    CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '2 minutes'
FROM chat_sessions
WHERE title = 'Project Alpha Discussion'
ORDER BY id
LIMIT 1;


INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'assistant',
    'The testing activity was assigned to the QA team before the October release.',
    CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '3 minutes'
FROM chat_sessions
WHERE title = 'Project Alpha Discussion'
ORDER BY id
LIMIT 1;


-- ------------------------------------------------------------
-- Weekly Meeting Chat
-- ------------------------------------------------------------

INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'user',
    'Give me a summary of the weekly meeting.',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM chat_sessions
WHERE title = 'Weekly Meeting Chat'
ORDER BY id
LIMIT 1;


INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'assistant',
    'The team discussed project progress, pending tasks, upcoming deadlines and deployment activities.',
    CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '1 minute'
FROM chat_sessions
WHERE title = 'Weekly Meeting Chat'
ORDER BY id
LIMIT 1;


INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'user',
    'What are the pending tasks?',
    CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '2 minutes'
FROM chat_sessions
WHERE title = 'Weekly Meeting Chat'
ORDER BY id
LIMIT 1;


INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'assistant',
    'The pending tasks include completing testing, reviewing deployment configuration and finalizing the project documentation.',
    CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '3 minutes'
FROM chat_sessions
WHERE title = 'Weekly Meeting Chat'
ORDER BY id
LIMIT 1;


-- ------------------------------------------------------------
-- Decision Review
-- ------------------------------------------------------------

INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'user',
    'What were the important decisions?',
    CURRENT_TIMESTAMP
FROM chat_sessions
WHERE title = 'Decision Review'
ORDER BY id
LIMIT 1;


INSERT INTO chat_messages
(
    session_id,
    role,
    content,
    created_at
)
SELECT
    id,
    'assistant',
    'The important decisions included the release timeline, testing requirements and deployment preparation.',
    CURRENT_TIMESTAMP + INTERVAL '1 minute'
FROM chat_sessions
WHERE title = 'Decision Review'
ORDER BY id
LIMIT 1;