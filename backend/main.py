from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routes import router

app = FastAPI(title="Evolution of Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Attempt to init DB on startup
    try:
        init_db()
    except Exception as e:
        print(f"Error initializing DB: {e}")

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Evolution of Todo API"}
