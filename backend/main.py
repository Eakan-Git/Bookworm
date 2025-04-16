from fastapi import FastAPI
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# API routers
from api.v1.endpoints import default as default_endpoint
from api.v1.endpoints import user as user_endpoint

# Database configuration
from database.postgres import PostgresDatabase
from sqlalchemy.orm import Session

# Initialize database instance
db_instance = PostgresDatabase()

app = FastAPI(
    title="Bookworm API",
    description="API for Bookworm, an ecommerce platform for book lovers.",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    try:
        db_instance.create_db_and_tables()
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")


# Include routers
app.include_router(default_endpoint.router, prefix="/api/v1", tags=["Default"])
app.include_router(user_endpoint.router, prefix="/api/v1", tags=["User"])

# Add dependency for database session
def get_db() -> Session:
    with db_instance.get_session() as db:
        yield db


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
