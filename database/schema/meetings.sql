CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    meeting_date DATE,
    start_time VARCHAR(20),
    end_time VARCHAR(20),
    organizer VARCHAR(100),
    join_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);