from sqlalchemy import String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
 
from app.database.base import Base


class FragilityReport(Base):
    __tablename__ = "fragility_reports"

    id: Mapped[int]                   = mapped_column(primary_key=True)
    broker_session_id: Mapped[int]    = mapped_column(ForeignKey("broker_sessions.id"))
    snapshot_id: Mapped[int]          = mapped_column(ForeignKey("portfolio_snapshots.id"))

    fragility_score: Mapped[int]      = mapped_column(Integer, nullable=False)
    fragility_label: Mapped[str]      = mapped_column(String, nullable=False)

    concentration_hhi: Mapped[float]  = mapped_column(Float, nullable=False)
    correlation_normal: Mapped[float] = mapped_column(Float, nullable=False)
    correlation_crisis: Mapped[float] = mapped_column(Float, nullable=False)

    worst_stress_loss: Mapped[float]  = mapped_column(Float, nullable=False)
    warning: Mapped[list]             = mapped_column(JSONB, default=list)
    stress_scenarios: Mapped[dict]    = mapped_column(JSONB, default=dict)

    created_at: Mapped[datetime]      = mapped_column(DateTime, default=datetime.utcnow)

    # Relationship
    broker_session = relationship("BrokerSession", back_populates="reports")
    snapshot = relationship("PortfolioSnapshot", back_populates="reports")