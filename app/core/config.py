from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # App
    APP_NAME: str = "Portfolio Fragility Analyzer"
    DEBUG: bool = True
   
    # DB
    DATABASE_URL: str

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Angel One
    ANGEL_API_KEY: str 
    ANGELONE_BASE_URL: str = "https://apiconnect.angelbroking.com"
    

    # Security
    ENCRYPTION_KEY: str 


    # Market Data
    NSE_INDEX_SYMBOL: str = "^NSEI"
    VIX_SYMBOL: str = "^INDIAVIX"


    class Config:
        env_file = ".env"


settings = Settings()