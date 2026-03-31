"""Simple in-memory rate limiter for FastAPI."""

import time
from collections import defaultdict

from fastapi import HTTPException, Request, status


class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.rpm = requests_per_minute
        self.requests: dict[str, list[float]] = defaultdict(list)

    def _get_key(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
        return ip

    def check(self, request: Request):
        key = self._get_key(request)
        now = time.time()
        window_start = now - 60

        # Remove old entries
        self.requests[key] = [t for t in self.requests[key] if t > window_start]

        if len(self.requests[key]) >= self.rpm:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Try again in a minute.",
            )

        self.requests[key].append(now)


# Global instances
default_limiter = RateLimiter(requests_per_minute=60)
auth_limiter = RateLimiter(requests_per_minute=10)  # Stricter for auth
