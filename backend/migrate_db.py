import os
import psycopg2
from dotenv import load_dotenv

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("DATABASE_URL not found in .env")
    exit(1)

try:
    # Connect to the database
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Add the due_date column
    print("Updating todo table with Phase IV columns...")
    cur.execute("ALTER TABLE todo ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITHOUT TIME ZONE;")
    cur.execute("ALTER TABLE todo ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES todo(id);")
    cur.execute("ALTER TABLE todo ADD COLUMN IF NOT EXISTS assignee TEXT;")
    
    conn.commit()
    print("Columns added successfully!")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
