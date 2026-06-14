from app.integrations.angelone.client import get_angel_client
from app.core.config import settings




async def login_to_angelone(client_code: str, password: str, totp: str) -> dict:

    client = get_angel_client(settings.ANGEL_API_KEY)

    response = client.generateSession(client_code, password, totp)

    # print(f"=== Angel One Response ===")
    # print(response)
    # print(f"==========================")

    if not response:
        raise Exception("Angel One returned empty response")

    if not response or not response.get("status"):
        raise Exception(f"Angel One login failed: {response.get('message', 'Unknown error')}")
    
    data = response["data"]

    return {
        "jwt_token":      data["jwtToken"],
        "refresh_token":  data["refreshToken"],
        "feed_token":     data["feedToken"],
    }