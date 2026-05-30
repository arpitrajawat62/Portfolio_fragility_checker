from sqlalchemy import String, Float, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Holding(Base):
    __tablename__ = "holdings"

    id: Mapped[int]                  = mapped_column(primary_key=True)
    broker_session_id: Mapped[int]   = mapped_column(ForeignKey("broker_sessions.id"))
    symbol: Mapped[str]              = mapped_column(String, nullable=False)
    quantity: Mapped[int]            = mapped_column(Integer, nullable=False)
    average_price: Mapped[float]     = mapped_column(Float, nullable=False)
    current_price: Mapped[float]     = mapped_column(Float, nullable=False)
    portfolio_weight: Mapped[float]  = mapped_column(Float, nullable=False)

    # Relationship
    broker_session = relationship("BrokerSession", back_populates="holdings")