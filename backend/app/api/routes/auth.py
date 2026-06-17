from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.auth_schema import LoginRequest, LoginResponse
from app.services import auth_service
import traceback



router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)



@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    try:
        result = await auth_service.login(
            db          = db,
            client_code = request.client_code,
            password    = request.password,
            totp        = request.totp
        )
        return result
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))