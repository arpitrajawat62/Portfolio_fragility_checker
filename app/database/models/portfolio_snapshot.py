from sqlalchemy import String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
 
from app.database.base import Base


class PortfolioSnapshot(Base):
    __tablename__ = "portfolio_snapshots"

    id: Mapped[int]                = mapped_column(primary_key=True)
    broker_session_id: Mapped[int] = mapped_column(ForeignKey("broker_sessions.id"))
    total_value: Mapped[float]     = mapped_column(Float, nullable=False)
    total_invested: Mapped[float]  = mapped_column(Float, nullable=False)
    total_pnl: Mapped[float]       = mapped_column(Float, nullable=False)
    num_holdings: Mapped[int]      = mapped_column(Integer, nullable=False)
    created_at : Mapped[datetime]  = mapped_column(DateTime, default=datetime.utcnow)

    # Relationship
    broker_session = relationship("BrokerSession", back_populates="snapshots")
    reports = relationship("FragilityReport", back_populates="snapshot")
