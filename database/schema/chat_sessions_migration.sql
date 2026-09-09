-- ============================================================
-- MIGRATION: Add recipient_id to chat_sessions
-- ============================================================
-- This migration adds support for user-to-user messaging
-- recipient_id is optional (NULL for AI chats, set for 1-on-1 chats)

-- Add recipient_id column if it doesn't exist
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS recipient_id BIGINT;

-- Add foreign key constraint
ALTER TABLE chat_sessions
ADD CONSTRAINT fk_chat_sessions_recipient
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create index for recipient queries
CREATE INDEX IF NOT EXISTS idx_chat_sessions_recipient_id
    ON chat_sessions(recipient_id);

-- Create composite index for finding 1-on-1 chats between two users
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_recipient
    ON chat_sessions(user_id, recipient_id);
