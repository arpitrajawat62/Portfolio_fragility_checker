from sqlalchemy.ext.asyncio import AsyncSession
 
from app.integrations.angelone.auth import login_to_angelone
from app.repositories import broker_repository
from app.core.security import encrypt_data, decrypt_data


async def login(db: AsyncSession, client_code: str, password: str, totp: str) -> dict:
    

    tokens = await login_to_angelone(client_code, password, totp)

    encrypted_jwt     = encrypt_data(tokens["jwt_token"])
    encrypted_feed    = encrypt_data(tokens["feed_token"])
    encrypted_refresh = encrypt_data(tokens["refresh_token"])
    

    existing = await broker_repository.get_by_client_code(db, client_code)


    if existing:
        existing.encrypted_jwt_token      = encrypted_jwt
        existing.encrypted_feed_token     = encrypted_feed
        existing.encrypted_refresh_token  = encrypted_refresh
        existing.is_active                = True
        await db.commit()
        
     
    else:
       
        await broker_repository.create_session(
            db            = db,
            client_code   = client_code,
            jwt_token     = encrypted_jwt,
            feed_token    = encrypted_feed,
            refresh_token = encrypted_refresh
        )

    return {
        "success": True,
        "client_code": client_code,
        "message": "Login_successful",
    }