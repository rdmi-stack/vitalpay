from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import close_db, connect_db
from app.routers import admin, auth, bills, claims, contact, dashboard, password_reset, patients, payments, statements, voice


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api")
app.include_router(bills.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(statements.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(voice.router, prefix="/api")
app.include_router(claims.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(password_reset.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": settings.APP_NAME}
