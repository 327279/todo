from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routes import router as todo_router
from ai_routes import router as ai_router
from analytics_routes import router as analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Attempt to init DB on startup
    try:
        init_db()
    except Exception as e:
        print(f"Error initializing DB: {e}")
    yield

app = FastAPI(title="Evolution of Todo API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todo_router)
app.include_router(ai_router)
app.include_router(analytics_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Evolution of Todo API"}

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "0.4.0"}
