from sqlalchemy.ext.asyncio import AsyncSession


from app.services.portfolio_service import get_portfolio
from app.repositories import report_repository, broker_repository
from app.risk import concentration, correlation, stress, scoring


async def analyze(db: AsyncSession, client_code: str) -> dict:


    # fetch fresh portfolio from Angel One
    # this gives us holdings list + snapshot saved in DB
    portfolio = await get_portfolio(db, client_code)

    holdings    = portfolio["holdings"]
    snapshot    = portfolio["snapshot"]
    total_value = portfolio["total_value"]
    

    # extract just the weights and symbols as plain lists
    #  we need these for all the risk calculation
    weights = [h["portfolio_weight"] for h in holdings]
    symbols = [h["symbol"] for h in holdings]


    # concentration risk
    hhi = concentration.calculate_hhi(weights)

    # correlation risk
    try:
        corr_normal, corr_crisis = await correlation.calculate_correlation(symbols)
    except Exception:
        corr_normal, corr_crisis = 0.0, 0.0

    # fragility
    corr_fragility = round(corr_crisis - corr_normal, 4)

    # volatility
    try:
        volatility, max_drawdown = await correlation.calculate_volatility_and_drawdown(symbols, weights)
    except Exception:
        volatility, max_drawdown = 0.0, 0.0


    # stress test
    stress_results = stress.run_all_scenarios(total_value, weights, symbols)

    # worst loss
    worst_loss = stress.get_worst_loss(stress_results)

    # combine everything into one score + label + warnings
    score, label, warnings_list = scoring.compute_score(
        hhi            = hhi,
        corr_fragility = corr_fragility,
        volatility     = volatility,
        worst_loss     = worst_loss,
        weights        = weights,
        symbols        = symbols
    )

    session = await broker_repository.get_by_client_code(db, client_code)
   
   # save the report to DB
    await report_repository.create_report(
        db                    = db,
        broker_session_id     = session.id,
        snapshot_id           = snapshot.id,
        fragility_score       = score,
        fragility_label       = label,
        concentration_hhi     = hhi,
        correlation_normal    = corr_normal,
        correlation_crisis    = corr_crisis,
        correlation_fragility = corr_fragility,
        portfolio_volatility  = volatility,
        max_drawdown          = max_drawdown,
        worst_stress_loss     = worst_loss,
        stress_scenarios      = stress_results,
        warnings              = warnings_list
    )

    return {
        "portfolio_value": total_value,
        "fragility_score": score,
        "fragility_label": label,
        "warnings"       : warnings_list,
        "metrics": {
            "concentration_hhi":     hhi,
            "correlation_normal":    corr_normal,
            "correlation_crisis":    corr_crisis,
            "correlation_fragility": corr_fragility,
            "portfolio_volatility":  volatility,
            "max_drawdown":          max_drawdown,
            "worst_stress_loss":     worst_loss,
        },
        "stress_scenarios": stress_results
    }