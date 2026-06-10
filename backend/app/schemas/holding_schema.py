from pydantic import BaseModel


class HoldingBase(BaseModel):
    
    symbol: str
    quantity: int
    average_price: float
    current_price: float
    portfolio_weight: float

class HoldingResponse(HoldingBase):
    id: int
    broker_session_id: int

    class Config:
        from_attributes = True
    