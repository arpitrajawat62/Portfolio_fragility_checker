import numpy as np
import yfinance as yf
from datetime import datetime, timedelta


def clean_symbol(symbol: str) -> str:

    symbol = symbol.split("-")[0]
    return symbol + ".NS"


def fetch_price_history(symbols: list[str], days: int) -> dict:

    end_date = datetime.today()
    start_date = end_date - timedelta(days=days)

    yahoo_symbols = [clean_symbol(s) for s in symbols]

    try:
        if len(yahoo_symbols) == 1:
            data = yf.download(
                 yahoo_symbols[0],
                 start = start_date.strftime("%Y-%m-%d"),
                 end   = end_date.strftime("%Y-%m-%d"),
                 progress = False,
                 auto_adjust = True
             )
            prices = data["Close"].dropna().tolist()
            if prices:
                return {symbols[0]: prices}
            return {}
        
        data = yf.download(
            yahoo_symbols,
            start       =  start_date.strftime("%Y-%m-%d"),
            end         =  end_date.strftime("%Y-%m-%d"),
            progress    =  False,
            auto_adjust =  True
        )["Close"]
    


        result = {}
        for i, symbol in enumerate(symbols):
            col = yahoo_symbols[i]
            if col in data.columns:
                prices = data[col].dropna().tolist()
                if len(prices) >= 10:   
                    result[symbol] = prices
                    print(f"  OK: {col} — {len(prices)} days of data")
                else:
                    print(f"  SKIP: {col} — only {len(prices)} data points")
            else:
                print(f"  MISSING: {col} — not in Yahoo Finance response")
 
        return result
    
    except Exception as e:
        print(f"Price fetch error: {e}")
        return {}
    

def calculate_avg_correlation(prices_dict: dict) -> float:

    symbols = list(prices_dict.keys())

    if len(symbols) < 2:
        return 0.0
    
    min_len = min(len(prices_dict[s]) for s in symbols)
    if min_len < 10:
        return 0.0
    

    returns_matrix = []
    for s in symbols:
        prices = prices_dict[s][-min_len:]
        returns = np.diff(prices) / prices[:-1]
        returns_matrix.append(returns)
        
    corr_matrix  = np.corrcoef(np.array(returns_matrix))
    correlations = []
    n = len(symbols)
    for i in range(n):
        for j in range(i + 1, n):
            correlations.append(corr_matrix[i][j])
    
    if not correlations:
        return 0.0
    
    return round(float(np.mean(correlations)), 4)


async def calculate_correlation(symbols: list[str]) -> tuple[float, float]:

    normal_prices = fetch_price_history(symbols, days=365)
    crisis_prices = fetch_price_history(symbols, days=60)

    corr_normal = calculate_avg_correlation(normal_prices)
    corr_crisis = calculate_avg_correlation(crisis_prices)

    return corr_normal, corr_crisis


async def calculate_volatility_and_drawdown(symbols: list[str], weights: list[float]) -> tuple[float, float]:

    prices_dict = fetch_price_history(symbols, days=365)

    if not prices_dict:
        return 0.0, 0.0
    
    valid_symbols = list(prices_dict.keys())
    if not valid_symbols:
        return 0.0, 0.0
    
    min_len = min(len(prices_dict[s]) for s in prices_dict)
    if min_len < 10:
        return 0.0, 0.0
    
    portfolio_returns = np.zeros(min_len - 1)

    for i, symbols in enumerate(symbols):
        if symbols not in prices_dict:
            continue
        prices = np.array(prices_dict[symbols][-min_len:], dtype=float)
        returns = np.diff(prices) / prices[:-1]
        portfolio_returns += weights[i] * returns

    
    volatility = float(np.std(portfolio_returns) * np.sqrt(252))


    cumulative = np.cumprod(1 + portfolio_returns)
    peak       = np.maximum.accumulate(cumulative)
    drawdown   = (cumulative - peak) / peak
    max_dd     = float(np.min(drawdown))

    return round(volatility, 4), round(max_dd, 4)

        
    

    