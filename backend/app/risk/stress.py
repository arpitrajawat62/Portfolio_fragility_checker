SCENARIOS = {
    "covid_crash_2020": {
        "label":        "COVID Crash (Mar 2020)",
        "equity_shock": -0.38,
        "beta":          1.1,
        "description":  "NIFTY fell 38% in 40 days during COVID lockdown"
    },
    "rate_hike_2022": {
        "label":        "Rate Hike Cycle (2022)",
        "equity_shock": -0.17,
        "beta":          1.0,
        "description":  "RBI aggressive rate hikes hurt valuations"
    },
    "currency_crisis": {
        "label":        "INR Depreciation (USDINR > 90)",
        "equity_shock": -0.12,
        "beta":          0.9,
        "description":  "Sharp INR fall increases import costs and inflation"
    }
}


def run_all_scenarios(total_value: float, weights: list[float], symbols: list[str]) -> dict:

    results = {}

    for scenarios_key, scenario in SCENARIOS.items():
        loss_pct = run_single_scenario(
            total_value   = total_value,
            equity_shock  = scenario['equity_shock'],
            beta          = scenario["beta"]
        )
        results[scenarios_key] = round(loss_pct, 4)
    
    return results

def run_single_scenario(total_value: float, equity_shock: float, beta: float) -> float:

    portfolio_loss_pct = equity_shock * beta
    return portfolio_loss_pct


def get_worst_loss(stress_results: dict) -> float:
    return min(stress_results.values())