


def score_concentration(hhi: float) -> float:
    return min(hhi * 100, 100)



def score_correlation(corr_fragility: float) -> float:
    return min((corr_fragility / 0.50) * 100, 100)


def score_volatility(volatility: float) -> float:
    return min((volatility / 0.40) * 100, 100)


def score_stress(worst_loss: float) -> float:
    return min((abs(worst_loss) / 0.50) * 100, 100)


def compute_score(hhi: float, corr_fragility: float, volatility: float, worst_loss: float, weights: list[float], symbols: list[float]) -> tuple[int, str, list[str]]:
    c_score = score_concentration(hhi)
    r_score = score_correlation(corr_fragility)
    v_score = score_volatility(volatility)
    s_score = score_stress(worst_loss)

    final_score = (
        c_score * 0.30 +
        r_score * 0.30 +
        v_score * 0.20 +
        s_score * 0.20 
    )

    final_score  = round(final_score)

    if final_score <= 33:
        label = "Low"
    elif final_score <= 66:
        label = "Medium"
    else:
        label = "High"

    warnings = []
    
    # concentration warning
    if hhi > 0.25:
        paired   = sorted(zip(symbols, weights), key=lambda x:x[1], reverse=True)
        top3     = paired[:3]
        top3_pct = sum(w for _, w in top3) * 100
        top3_sym = ", ".join(s for s, _ in top3)
        warnings.append(f"Top 3 stocks ({top3_sym}) make up {top3_pct:.0f}% of your portfolio")
    
    elif hhi > 0.15:
        warnings.append("Portfolio is moderately concentrated - consider diversifying")
    

    # correlation warning
    if corr_fragility > 0.38:
        warnings.append("Your stocks become highly correlated during market crashes — diversification breaks down")

    elif corr_fragility > 0.15:
        warnings.append("Mild correlation increase during stress — some diversification benefit lost in crashes")

    
    # volatility warning
    if volatility > 0.30:
         warnings.append(f"High portfolio volatility ({volatility*100:.0f}% annualised) — large daily swings expected")

    
    # stress warning
    if worst_loss < -0.35:
        warnings.append(f"In a COVID-like crash your portfolio could lose {abs(worst_loss)*100:.0f}% of its value")
 
    elif worst_loss < -0.20:
        warnings.append(f"Moderate crash sensitivity — estimated loss of {abs(worst_loss)*100:.0f}% in worst scenario")

    

    # if no warnings, portfolio is healthy
    if not warnings:
        warnings.append("Portfolio looks well diversified — no major risk flags found")
 
    return final_score, label, warnings
