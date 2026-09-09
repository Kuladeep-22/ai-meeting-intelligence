-- ============================================================
-- MIGRATION: Add sender_id to chat_messages
-- ============================================================
-- This migration tracks who sent each message in the conversation

-- Add sender_id column if it doesn't exist
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS sender_id BIGINT;

-- Add foreign key constraint
ALTER TABLE chat_messages
ADD CONSTRAINT fk_chat_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create index for sender queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id
    ON chat_messages(sender_id);

-- Extend role constraint to include 'system' if not already present
-- Note: The constraint already includes 'system' in the original schema
