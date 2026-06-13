from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
 
from app.database.models.fragility_report import FragilityReport



async def create_report(db: AsyncSession, broker_session_id: int, snapshot_id: int,
                        fragility_score: int, fragility_label: str, concentration_hhi: float,
                        correlation_normal: float, correlation_crisis: float, correlation_fragility: float, 
                        portfolio_volatility: float, max_drawdown: float, worst_stress_loss: float, 
                        stress_scenarios: dict, warnings: list
                        ) -> FragilityReport:
    
    report = FragilityReport(
        broker_session_id     =  broker_session_id,
        snapshot_id           =  snapshot_id,
        fragility_score       =  fragility_score,
        fragility_label       =  fragility_label,
        concentration_hhi     =  concentration_hhi,
        correlation_normal    =  correlation_normal,
        correlation_crisis    =  correlation_crisis,
        correlation_fragility =  correlation_fragility,
        portfolio_volatility  =  portfolio_volatility,
        max_drawdown          =  max_drawdown,
        worst_stress_loss     =  worst_stress_loss,
        stress_scenarios      =  stress_scenarios,
        warnings              =  warnings
    )
    db.add(report)
    await db.flush()
    await db.refresh(report)
    return report

async def get_latest_by_session_id(db: AsyncSession, broker_session_id: int) -> FragilityReport | None:
    result = await db.execute(
        select(FragilityReport)
        .where(FragilityReport.broker_session_id == broker_session_id)
        .order_by(FragilityReport.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def get_by_snapshot_id(db: AsyncSession, snapshot_id: int) -> FragilityReport | None:
    result = await db.execute(
        select(FragilityReport).where(FragilityReport.snapshot_id == snapshot_id)
    )
    return result.scalar_one_or_none()