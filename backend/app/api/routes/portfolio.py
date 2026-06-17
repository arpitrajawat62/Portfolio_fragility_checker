from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.services import portfolio_service
import traceback

router = APIRouter(
   prefix="/portfolio",
   tags=["portfolio"]
)



@router.get("/{client_code}")
async def fetch_portfolio(client_code: str, db: AsyncSession = Depends(get_db)):

    try:
        result = await portfolio_service.get_portfolio(
            db          = db,
            client_code = client_code
        )
        return result
    
    except Exception as e:
        traceback.print_exc()
        print("ERROR:", repr(e))
        
        raise HTTPException(status_code=400, detail=str(e))