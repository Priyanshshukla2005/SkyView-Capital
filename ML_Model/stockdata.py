import yfinance as yf
import numpy as np
import pandas as pd
import datetime as dt
from pandas_datareader import data as pdr

def _normalize_ticker(raw):
    return (raw or "").split("-")[0].strip().upper()

def _fetch_history(ticker, *, session=None, period=None, start=None, end=None, interval="1d"):
    """
    Best-effort historical OHLCV fetch.
    Tries yfinance first; if blocked/empty, falls back to Stooq via pandas_datareader.
    Returns a DataFrame with at least ['Open','High','Low','Close','Volume'] and a datetime index.
    """
    # 1) yfinance
    try:
        df = yf.download(
            ticker,
            period=period,
            start=start,
            end=end,
            interval=interval,
            progress=False,
            threads=False,
            session=session,
        )
        if df is not None and not df.empty and "Close" in df.columns:
            return df
    except Exception:
        pass

    # 2) Stooq fallback (free, often works when Yahoo blocks)
    # Stooq expects symbols like AAPL.US for US equities.
    stooq_symbol = ticker if "." in ticker else f"{ticker}.US"
    try:
        s = start if start is not None else (dt.datetime.now() - dt.timedelta(days=365 * 5))
        e = end if end is not None else dt.datetime.now()
        df = pdr.DataReader(stooq_symbol, "stooq", s, e)
        if df is None or df.empty or "Close" not in df.columns:
            return None
        # Stooq returns newest-first; sort oldest->newest to match expectations.
        df = df.sort_index()
        return df
    except Exception:
        return None

def stock_data(company):

    # yfinance frequently fails/timeouts on extremely large ranges.
    # Prefer period-based queries and retry with smaller periods.
    ticker = _normalize_ticker(company)
    if not ticker:
        return {"error": "Missing ticker symbol"}

    import requests
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0 Safari/537.36"
        }
    )

    df = None
    for period in ("5y", "2y", "1y", "6mo"):
        df = _fetch_history(ticker, session=session, period=period, interval="1d")
        if df is not None and not df.empty and "Close" in df.columns:
            break

    if df is None or df.empty or "Close" not in df.columns:
        return {
            "error": "Stock data fetch failed",
            "ticker": ticker,
            "detail": "No data returned from providers (Yahoo/Stooq).",
        }

    prices = np.array(df["Close"], dtype=float)
    dates = np.array(df.index)
    prices_list=prices.tolist()
    dates_list=dates.tolist()

    stock_variable_obj=stock_variables(ticker, session=session)

    search_object= {
        "prices":prices_list,
        "dates":dates_list,
        "stock":stock_variable_obj
    }

    return search_object


def stock_variables(company, session=None):

    ticker = _normalize_ticker(company)
    if not ticker:
        return {
            "high": 0,
            "low": 0,
            "prev_close": 0,
            "returns": 0,
            "avg_volume": 0,
            "high_prev": 0,
            "low_prev": 0,
            "market_cap": 0
    }

    past_price = _fetch_history(ticker, session=session, period="1y", interval="1d")

    if past_price is None or past_price.empty:
        return {
            "high": 0,
            "low": 0,
            "prev_close": 0,
            "returns": 0,
            "avg_volume": 0,
            "high_prev": 0,
            "low_prev": 0,
            "market_cap": 0,
        }

    initial_price = float(past_price["Close"].iloc[0])

    high = float(np.array(past_price["High"].max())) # 52 Week High
    low = float(np.array(past_price["Low"].min())) # 52 Week Low
    prev_close = float(past_price["Close"].iloc[-1])# Prev Close
    returns = (((prev_close - initial_price)/initial_price) * 100) # 52 Week Returns
    avg_volume = float(np.array(past_price["Volume"].mean())/1000000) # Average Volume #M
    high_prev = float(past_price["High"].iloc[-1]) # Prev day High
    low_prev = float(past_price["Low"].iloc[-1]) # Prev day Low

    # Market cap is best-effort (often blocked/limited by Yahoo).
    market_cap = 0
    try:
        t = yf.Ticker(ticker, session=session)
        fi = getattr(t, "fast_info", None)
        if fi and "market_cap" in fi and fi["market_cap"] is not None:
            market_cap = float(fi["market_cap"]) / 1000000000000
    except Exception:
        market_cap = 0
    
    high = float("{:.2f}".format(high))
    low = float("{:.2f}".format(low))
    prev_close = float("{:.2f}".format(prev_close))
    returns = float("{:.2f}".format(returns))
    avg_volume = float("{:.2f}".format(avg_volume))
    high_prev = float("{:.2f}".format(high_prev))
    low_prev = float("{:.2f}".format(low_prev))
    market_cap = float("{:.2f}".format(market_cap))

    variable_object={
        "high" :high ,
        "low" :low ,
        "prev_close" :prev_close ,
        "returns" :returns ,
        "avg_volume" :avg_volume ,
        "high_prev" :high_prev ,
        "low_prev" :low_prev ,
        "market_cap":market_cap
    }

    return variable_object