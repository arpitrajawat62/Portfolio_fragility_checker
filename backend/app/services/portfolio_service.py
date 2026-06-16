from sqlalchemy.ext.asyncio import AsyncSession
 
from app.integrations.angelone.holdings import fetch_holdings
from app.repositories import broker_repository, holding_repository, snapshot_repository
from app.core.security import decrypt_data



async def get_portfolio(db: AsyncSession, client_code: str) -> dict:

    session = await broker_repository.get_by_client_code(db, client_code)

    if not session:
        raise Exception("No session found. Please login first.")
    
    if not session.is_active:
        raise  Exception("Session is not active. Please login again.")
    
    
    jwt_token = decrypt_data(session.encrypted_jwt_token)
    
    # Fetch holdings 
    raw_holdings = await fetch_holdings(jwt_token)

    if not raw_holdings:
        raise Exception("No holdings found in your Angel one account.")
    
    # Calculating portfolio total worth
    total_value = sum(h["quantity"] * h["current_price"] for h in raw_holdings)


    # calculate total money user originally put in
    total_invested = sum(h["quantity"] * h["average_price"] for h in raw_holdings)


    # profit or loss in rupees
    total_pnl = total_value - total_invested


    #calculate portfolio_weight for each stock
    for h in raw_holdings:
        market_value  = h["quantity"] * h["current_price"]
        h["portfolio_weight"] = round(market_value/ total_value, 4) if total_value > 0 else 0

    
    # save a snapshot to db
    snapshot = await snapshot_repository.create_snapshot(
        db                = db,
        broker_session_id = session.id,
        total_value       = total_value,
        total_invested    = total_invested,
        total_pnl         = total_pnl,
        num_holdings      = len(raw_holdings)
    )

    # save each individual stock to the holdings table
    for h in raw_holdings:
        await holding_repository.create_holding(
            db                = db,
            broker_session_id = session.id,
            symbol            = h["symbol"],
            quantity          = h["quantity"],
            average_price     = h["average_price"],
            current_price     = h["current_price"],
            portfolio_weight  = h["portfolio_weight"]
        )
    return {
        "snapshot":       snapshot,
        "holdings":       raw_holdings,
        "total_value":    total_value,
        "total_invested": total_invested,
        "total_pnl":      total_pnl
    }



    