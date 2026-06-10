from pydantic import BaseModel
from datetime import datetime



class FragilityReportBase(BaseModel):
    fragility_score: int
    fragility_label: str

    concentration_hhi: float

    correlation_normal: float
    correlation_crisi: float

    worst_stress_loss: float

    warnings: list[str]
    stress_scenarios: dict


class FragilityReportCreate(FragilityReportBase):
    pass


class FragilityReportResponse(FragilityReportBase):
    id: int
    broker_session_id: int
    snapshot_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AnalyzeRequest(BaseModel):
    client_code: str
