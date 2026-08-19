CREATE TABLE action_items (
    id SERIAL PRIMARY KEY,
    meeting_id INTEGER NOT NULL,
    title VARCHAR(200),
    assigned_to VARCHAR(100),
    deadline DATE,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_action_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES meetings(id)
        ON DELETE CASCADE
);