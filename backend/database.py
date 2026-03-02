import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel

# Load .env from the same directory as this file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback for development if URL not provided yet
    DATABASE_URL = "postgresql://user:password@localhost/dbname"

engine = create_engine(
    DATABASE_URL, 
    echo=os.getenv("SQL_ECHO", "False").lower() == "true",
    pool_pre_ping=True,
    pool_recycle=3600
)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
