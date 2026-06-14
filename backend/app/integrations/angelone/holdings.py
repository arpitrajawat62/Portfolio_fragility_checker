from app.integrations.angelone.client import get_angel_client
from app.core.config import settings
 


async def fetch_holdings(jwt_token: str) -> list[dict]:

    client = get_angel_client(settings.ANGEL_API_KEY)
    
    token = jwt_token.replace("Bearer ", "").strip()
    client.setAccessToken(token)

    response = client.holding()

    if not response or not response.get("status"):
        raise Exception(f"Failed to fetch holdings: {response.get('message', 'Unknown error')}")
    
    raw_holdings = response.get("data") or []

    holdings = []
    for h in raw_holdings:
        holdings.append({
            "symbol":        h.get("tradingsymbol"),
            "quantity":      int(h.get("quantity", 0)),
            "average_price": float(h.get("averageprice", 0)),
            "current_price": float(h.get("ltp", 0)),
        })
 
    return holdings
 