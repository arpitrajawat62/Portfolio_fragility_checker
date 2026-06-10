from pydantic import BaseModel
from datetime import datetime


from app.schemas.holding_schema import HoldingResponse



class PortfolioSnapshotBase(BaseModel):
    
    total_value: float
    total_invested: float
    total_pnl: float
    num_holdings: int
    

class PortfolioSnapshotCreate(PortfolioSnapshotBase):
    pass

class PortfolioSnapshotResponse(PortfolioSnapshotBase):
    id: int
    broker_session_id: int
    created_at: datetime
    holdings: list[HoldingResponse] = []

    class Config:
        from_attributes = True