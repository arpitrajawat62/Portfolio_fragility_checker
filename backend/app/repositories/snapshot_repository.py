from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
 
from app.database.models.portfolio_snapshot import PortfolioSnapshot


async def create_snapshot(db: AsyncSession, broker_session_id: int,
                          total_value: float, total_invested: float,
                          total_pnl:  float, num_holdings: int) -> PortfolioSnapshot:
    
    snapshot = PortfolioSnapshot(
        broker_session_id=broker_session_id,
        total_value=total_value,
        total_invested=total_invested,
        total_pnl=total_pnl,
        num_holdings=num_holdings
    )
    db.add(snapshot)
    await db.commit()
    await db.refresh(snapshot)
    return snapshot


async def get_latest_by_session_id(db: AsyncSession, broker_session_id: int) -> PortfolioSnapshot | None:
    result = await db.execute(
        select(PortfolioSnapshot).where(PortfolioSnapshot.broker_session_id == broker_session_id)
        .order_by(PortfolioSnapshot.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()

async def get_all_by_session_id(db: AsyncSession, broker_session_id: int) -> list[PortfolioSnapshot]:

    result = await db.execute(
        select(PortfolioSnapshot).where(PortfolioSnapshot.broker_session_id == broker_session_id)
        .order_by(PortfolioSnapshot.created_at.desc())
    )
    return result.scalars().all()