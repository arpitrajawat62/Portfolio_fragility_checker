from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager


from app.database.base import Base
from app.database.session import engine
from app.cache.redis_client import init_redis, close_redis


from app.api.routes.auth import router as auth_router
from app.api.routes.portfolio import router as portfolio_router
from app.api.routes.fragility import router as fragility_router
from app.api.routes.health import router as health_router




@asynccontextmanager
async def lifespan(app: FastAPI):    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    try:
        await init_redis()
    except Exception as e:
        print(f"Redis conncetion failed: {e} - caching disabled")

    yield

    await close_redis()


app = FastAPI(
    title="Portfolio Fragility Cheker",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(health_router)
app.include_router(portfolio_router)
app.include_router(fragility_router)

