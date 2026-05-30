from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database.base import Base

class BrokerSession(Base):
    __tablename__ = "broker_sessions"
    

    id: Mapped[int]                       = mapped_column(primary_key=True)
    client_code: Mapped[str]              = mapped_column(String, nullable=False)
    encrypted_jwt_token: Mapped[str]      = mapped_column(String, nullable=False)
    encryptes_refresh_token: Mapped[str]  = mapped_column(String, nullable=True)
    encrypted_feed_token: Mapped[str]     = mapped_column(String, nullable=False)
    is_active: Mapped[bool]               = mapped_column(default=True)

    created_at: Mapped[datetime]          = mapped_column(DateTime, default=datetime.utcnow)

    holdings = relationship("Holding", back_populates="broker_session")
    snapshots = relationship("PortfolioSnapshot", back_populates="broker_session")
    reports = relationship("FragilityReport", back_populates="broker_session")