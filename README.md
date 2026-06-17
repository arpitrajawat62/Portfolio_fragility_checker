# Portfolio Fragility Checker

A backend-heavy full-stack application that connects to your **Angel One** trading account, fetches your live portfolio holdings, and computes risk/fragility metrics using real market data.

Built as a college portfolio project to demonstrate layered architecture, broker API integration, and financial risk analysis.

---

## What it does

Most investors know their portfolio value but have no idea how **fragile** it is. This tool answers:

- Are you too concentrated in a few stocks?
- Will your stocks crash together during a market crisis?
- How much would you lose in a COVID-like crash?
- What is your overall fragility score?

You get a **0–100 fragility score** with plain-English warnings and interactive charts.

---

## Demo

```
Login with Angel One → Fetch live holdings → Run risk engine → See results
```

**Example output:**
```json
{
  "portfolio_value": 10035.99,
  "fragility_score": 35,
  "fragility_label": "Medium",
  "warnings": [
    "Top 3 stocks make up 90% of your portfolio",
    "In a COVID-like crash your portfolio could lose 42%"
  ],
  "metrics": {
    "concentration_hhi": 0.3347,
    "correlation_normal": 0.198,
    "correlation_crisis": 0.198,
    "portfolio_volatility": 0.1554,
    "max_drawdown": -0.2533,
    "worst_stress_loss": -0.418
  }
}
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.11** | Core language |
| **FastAPI** | REST API framework |
| **SQLAlchemy (async)** | ORM for database access |
| **PostgreSQL** | Stores sessions, holdings, reports |
| **Redis** | Market data caching |
| **Angel One SmartAPI** | Fetches live portfolio holdings |
| **Yahoo Finance (yfinance)** | Historical price data for risk calculations |
| **Fernet (cryptography)** | Encrypts Angel One JWT tokens before storing |
| **Pandas / NumPy** | Risk metric calculations |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **Recharts** | Charts (pie chart, bar chart) |
| **Axios** | HTTP requests to backend |
| **nginx** | Serves built React app in Docker |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerisation |
| **Docker Compose** | Runs all 4 services together |

---

## Architecture

```
Frontend (React)
      │
      │  POST /api/v1/auth/login
      │  POST /api/v1/analyze
      │  GET  /api/v1/portfolio/{client_code}
      ▼
Backend (FastAPI)
      │
      ├── Routes → Services → Repositories → Models
      │
      ├── Angel One SmartAPI  (live holdings)
      ├── Yahoo Finance       (historical prices)
      ├── PostgreSQL          (persistent storage)
      └── Redis               (market data cache)
```

### Data Flow

```
1. User fills login form (client_code + password + TOTP)
2. Backend calls Angel One SmartAPI → receives JWT token
3. JWT is encrypted with Fernet and stored in PostgreSQL
4. User clicks "Analyse Portfolio"
5. Backend decrypts JWT → calls Angel One holdings API
6. Holdings are saved to DB with portfolio weights calculated
7. Risk engine runs 4 calculations:
   a. Concentration risk (Herfindahl-Hirschman Index)
   b. Correlation fragility (normal vs crisis correlation via Yahoo Finance)
   c. Portfolio volatility and max drawdown
   d. Stress test (3 predefined crash scenarios)
8. Scores combined into 0-100 fragility score
9. Report saved to DB and returned to frontend
10. Frontend displays score, charts, warnings, metrics table
```

---

## Risk Metrics Explained

### Fragility Score (0–100)
A weighted combination of all risk metrics:
- Concentration × 30%
- Correlation fragility × 30%
- Volatility × 20%
- Worst stress loss × 20%

### Concentration Risk (HHI)
Herfindahl-Hirschman Index — sum of squared portfolio weights.
- `< 0.15` → Well diversified ✅
- `0.15–0.25` → Moderately concentrated ⚠️
- `> 0.25` → Highly concentrated ❌

### Correlation Fragility
Average pairwise correlation between stocks in normal times vs crisis times (last 60 days).
A large gap means diversification breaks down exactly when you need it most.

### Stress Scenarios
Three real historical events simulated on your current portfolio:
| Scenario | Market Drop | Based On |
|---|---|---|
| COVID Crash 2020 | -38% | NIFTY March 2020 crash |
| Rate Hike Cycle 2022 | -17% | RBI aggressive rate hikes |
| INR Depreciation | -12% | Sharp INR weakening |

### Portfolio Volatility
Annualised standard deviation of daily portfolio returns.
`15%` means portfolio swings ±15% per year on average.

### Max Drawdown
Worst peak-to-trough drop in the last year.
`-25%` means the portfolio fell 25% from its highest point at some stage.

---

## Project Structure

```
project/
│
├── docker-compose.yml          # runs all 4 services
├── .gitignore
│
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app factory
│   │   ├── core/
│   │   │   ├── config.py       # settings from .env
│   │   │   └── security.py     # Fernet encrypt/decrypt
│   │   ├── database/
│   │   │   ├── base.py         # SQLAlchemy Base
│   │   │   ├── session.py      # DB connection + get_db()
│   │   │   └── models/         # 4 DB tables
│   │   ├── schemas/            # Pydantic request/response shapes
│   │   ├── api/routes/         # HTTP endpoints
│   │   ├── services/           # Business logic
│   │   ├── repositories/       # DB queries
│   │   ├── risk/               # Risk engine
│   │   │   ├── concentration.py
│   │   │   ├── correlation.py
│   │   │   ├── stress.py
│   │   │   └── scoring.py
│   │   └── integrations/
│   │       └── angelone/       # SmartAPI client
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env                    # ← NOT committed to git
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── DashboardPage.jsx
    │   └── components/
    │       ├── ScoreCard.jsx
    │       ├── WarningsList.jsx
    │       ├── MetricsTable.jsx
    │       ├── StressChart.jsx
    │       └── PortfolioPieChart.jsx
    ├── Dockerfile
    ├── nginx.conf
    └── package.json
```

---

## Database Schema

```
broker_sessions       — stores encrypted Angel One JWT per user
portfolio_snapshots   — point-in-time portfolio summary
holdings              — individual stock positions
fragility_reports     — computed risk metrics and score
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/auth/login` | Login with Angel One credentials |
| `GET` | `/api/v1/portfolio/{client_code}` | Fetch live holdings |
| `POST` | `/api/v1/analyze` | Run full risk analysis |

---

## Running Locally

### Prerequisites
- Docker Desktop installed and running
- Angel One account with SmartAPI enabled
- Google Authenticator set up for TOTP

### Setup

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/portfolio-fragility-checker
cd portfolio-fragility-checker
```

**2. Create the `.env` file inside `backend/`**
```bash
# backend/.env

APP_NAME=Portfolio Fragility Checker
DEBUG=True

DATABASE_URL=postgresql+asyncpg://admin:admin123@postgres:5432/portfolio_db
REDIS_URL=redis://redis:6379/0

ANGEL_API_KEY=your_angel_one_api_key_here
ANGELONE_BASE_URL=https://apiconnect.angelbroking.com

# generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
ENCRYPTION_KEY=your_generated_fernet_key_here

NSE_INDEX_SYMBOL=^NSEI
VIX_SYMBOL=^INDIAVIX
```

**3. Start all services**
```bash
docker-compose up --build
```

**4. Open the app**
```
http://localhost:3000
```

### First time login
1. Go to `https://smartapi.angelbroking.com` → create an app → copy the API key
2. Put it in `backend/.env` as `ANGEL_API_KEY`
3. Enable TOTP on your Angel One mobile app → scan QR with Google Authenticator
4. Open `http://localhost:3000` → enter your client code, password, and TOTP

---

## How Angel One Authentication Works

Angel One uses **TOTP-based direct authentication** — not OAuth redirect. This means:
1. User enters client_code + password + 6-digit TOTP from Google Authenticator
2. Backend calls Angel One SmartAPI directly and receives a JWT token
3. JWT is encrypted with Fernet and stored in PostgreSQL
4. All subsequent API calls use the stored JWT — user only needs to log in once per session

There is **no separate app-level user authentication** — the only credentials are the Angel One ones.

---

## Key Design Decisions

**Why store the JWT encrypted?**
Angel One JWT tokens are sensitive credentials. Storing them in plaintext in a database is a security risk. Fernet encryption ensures they are unreadable if the database is ever accessed directly.

**Why `db.flush()` instead of `db.commit()` in repositories?**
FastAPI's `get_db()` dependency handles the commit automatically after the route finishes. Using `db.commit()` in repositories causes a double-commit error.

**Why is SmartAPI called synchronously?**
The `smartapi-python` library is synchronous, not async. Calling it with `await` causes issues. It's called as a regular function inside async FastAPI routes.

**Why strip `-EQ` from stock symbols?**
Angel One returns symbols like `HINDUNILVR-EQ` but Yahoo Finance expects `HINDUNILVR.NS`. The `clean_symbol()` function in `correlation.py` handles this conversion.

---

## What I Learned

- Building a layered FastAPI architecture (Routes → Services → Repositories → Models)
- Integrating a broker API (Angel One SmartAPI) with TOTP authentication
- Computing financial risk metrics from scratch (HHI, correlation matrices, drawdown)
- Async SQLAlchemy with PostgreSQL
- Dockerising a multi-service full-stack application
- Debugging real API integration issues (rate limiting, token formats, symbol normalization)

---

## License

MIT — free to use for learning and personal projects.
