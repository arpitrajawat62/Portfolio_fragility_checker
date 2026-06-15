


def calculate_hhi(weights: list[float]) -> float:

    hhi = sum(w ** 2 for w in weights)
    return round(hhi, 4)


def get_top_holdings_concentration(weights: list[float], symbols: list[str], top_n: int = 3) -> dict:


    paired = sorted(zip(symbols, weights), key=lambda x: x[1], reverse=True)

    top = paired[:top_n]
    top_concentration = sum(w for _, w in top)
    top_symbols = [s for s, _ in top]

    return {
        "top_symbols": top_symbols,
        "top_concentration": round(top_concentration, 4)
    }

