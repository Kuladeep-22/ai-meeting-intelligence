CREATE TABLE decisions (
    id SERIAL PRIMARY KEY,
    meeting_id INTEGER NOT NULL,
    title VARCHAR(200),
    description TEXT,
    owner VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_decision_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES meetings(id)
        ON DELETE CASCADE
);