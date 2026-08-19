CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    meeting_id INTEGER NOT NULL,
    user_name VARCHAR(100),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES meetings(id)
        ON DELETE CASCADE
);