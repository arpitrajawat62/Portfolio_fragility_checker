from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


from app.database.models.broker_session import BrokerSession



async def create_session(db: AsyncSession, client_code: str, jwt_token: str, feed_token: str, refresh_token: str) -> BrokerSession:
    session = BrokerSession(
        client_code=client_code,
        encrypted_jwt_token=jwt_token,
        encrypted_feed_token=feed_token,
        encrypted_refresh_token=refresh_token,
        is_active=True
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def get_by_client_code(db: AsyncSession, client_code: str) -> BrokerSession | None:
    result = await db.execute(
        select(BrokerSession).where(BrokerSession.client_code==client_code)
    )
    return result.scalar_one_or_none()


async def deactivate_session(db: AsyncSession, client_code: str) -> None:
    session = await get_by_client_code(db, client_code)
    if session:
        session.is_active = False
        await db.commit()