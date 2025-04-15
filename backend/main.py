from fastapi import FastAPI
import uvicorn
from api.v1.endpoints import default as default_endpoint
from api.v1.endpoints import user as user_endpoint


app = FastAPI(
    title="Bookworm API",
    description="API for Bookworm, an ecommerce platform for book lovers.",
    version="1.0.0",
)


app.include_router(default_endpoint.router, prefix="/api/v1", tags=["default"])
app.include_router(user_endpoint.router, prefix="/api/v1", tags=["user"])

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
