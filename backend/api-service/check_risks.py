from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

result = db.execute(
    text("""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'risks'
        ORDER BY ordinal_position
    """)
)

for row in result:
    print(row)

db.close()
