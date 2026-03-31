from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "PayVital API"
    DEBUG: bool = False
    API_PREFIX: str = "/api"

    # MongoDB
    MONGODB_URI: str
    DB_NAME: str = "payvital"

    # JWT
    JWT_SECRET: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS — comma-separated allowed origins
    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3010,http://localhost:3015,https://www.payvital.com,https://payvital.com,https://vitalpay.vercel.app"

    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
