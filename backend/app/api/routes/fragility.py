from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.fragility_schema import AnalyzeRequest, FragilityReportResponse
from app.services import fragility_service




router = APIRouter(
    prefix="/Fragility_score",
    tags=["fragility_score"]
)


@router.post("/analyze")
async def analyze(request: AnalyzeRequest, db: AsyncSession = Depends(get_db)):
    try:
        result = await fragility_service.analyze(
            db          =   db,
            client_code = request.client_code
        )
        return result
    
    except Exception as e:
        
        raise HTTPException(status_code=400, detail=str(e))