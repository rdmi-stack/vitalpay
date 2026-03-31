import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.database import close_db, connect_db
from app.services.scheduler import scheduler_loop
from app.routers import admin, auth, bills, branding, claims, contact, dashboard, export, password_reset, patients, payments, statements, voice, webhooks, ws


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    # Start background scheduler for automated reminders
    task = asyncio.create_task(scheduler_loop())
    yield
    task.cancel()
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
    allow_origins=settings.cors_origins_list,
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
app.include_router(export.router, prefix="/api")
app.include_router(webhooks.router, prefix="/api")
app.include_router(branding.router, prefix="/api")
app.include_router(ws.router)


## Rate Limiting Middleware
from app.core.rate_limit import default_limiter, auth_limiter

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/auth"):
            auth_limiter.check(request)
        else:
            default_limiter.check(request)
        return await call_next(request)

app.add_middleware(RateLimitMiddleware)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": settings.APP_NAME}
