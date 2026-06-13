from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.database.models.holding import Holding


async def create_holding(
        db: AsyncSession, broker_session_id: int, 
        symbol: str, quantity: int, 
        average_price: float,  current_price: float,
        portfolio_weight: float
        ) -> Holding:
    
    holding = Holding(
        broker_session_id=broker_session_id,
        symbol=symbol,
        quantity=quantity,
        average_price=average_price,
        current_price=current_price,
        portfolio_weight=portfolio_weight
    )

    db.add(holding)
    await db.commit()
    await db.refresh(holding)
    return holding

async def get_by_session_id(db: AsyncSession, broker_session_id: int) -> list[Holding]:
    result = await db.execute(
        select(Holding).where(Holding.broker_session_id == broker_session_id)
    )
    return result.scalars().all()


async def delete_by_session_id(db: AsyncSession, broker_session_id: int) -> None:
    await db.execute(
        delete(Holding).where(Holding.broker_session_id == broker_session_id)
    )
    await db.commit()