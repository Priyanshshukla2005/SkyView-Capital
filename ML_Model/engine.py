import yfinance as yf
import numpy as np
import pandas as pd
import datetime as dt
from pandas_datareader import data as pdr
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import stockdata

_SENTIMENT_MODEL_ID = 'nlptown/bert-base-multilingual-uncased-sentiment'
_sentiment_tokenizer = None
_sentiment_model = None

def _get_sentiment_model():
    global _sentiment_tokenizer, _sentiment_model
    if _sentiment_tokenizer is None or _sentiment_model is None:
        _sentiment_tokenizer = AutoTokenizer.from_pretrained(_SENTIMENT_MODEL_ID)
        _sentiment_model = AutoModelForSequenceClassification.from_pretrained(_SENTIMENT_MODEL_ID)
    return _sentiment_tokenizer, _sentiment_model

class predictions:
    def __init__(self, predicted_prices, dates, predicted_sentiment, advise):
        self.predicted_prices = predicted_prices
        self.dates = dates
        self.predicted_sentiment = predicted_sentiment
        self.advise = advise

def build_dataset(sequence, n_steps):
  X, y = list(), list()
  for i in range(len(sequence)):
    end_ix = i + n_steps
    if end_ix > len(sequence) - 1:
      break
    seq_x = sequence[i:end_ix]
    seq_y = sequence[end_ix]
    X.append(seq_x)
    y.append(seq_y)
  return np.array(X, dtype=float), np.array(y, dtype=float)


def predict_price(startdate, enddate, batch_size, prediction_days, company):
    
    start = dt.datetime.strptime(startdate, "%Y-%m-%d")
    end = dt.datetime.strptime(enddate, "%Y-%m-%d")
    import requests

    session = requests.Session()
    session.headers['User-Agent'] = 'Mozilla/5.0'

    ticker = (company or "").split("-")[0].strip().upper()
    df = stockdata._fetch_history(ticker, session=session, start=start, end=end, interval="1d")

    if df is None or getattr(df, "empty", True):
        raise Exception(f"Stock data fetch failed for {ticker}")

    seq = df['Close']
    seq = np.array(seq, dtype=float)
    # Keep the training window bounded for speed/stability.
    # Using too many points can make this endpoint unbearably slow.
    if seq.shape[0] > 420:
        seq = seq[-420:]
    n_steps = batch_size
    n_features = 1
    X, Y = build_dataset(seq, n_steps)
    X = X.reshape([X.shape[0], X.shape[1], n_features])

    model = Sequential()
    model.add(LSTM(27, activation='relu', return_sequences=True, input_shape=(n_steps, n_features)))
    model.add(LSTM(27, activation='relu'))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')
    # Fewer epochs to keep API responsive.
    model.fit(X, Y, epochs=3, verbose=0)

    x_input = seq[-n_steps:]
    x_input = x_input.reshape((1, n_steps, n_features))
    yhat = model.predict(x_input, verbose=0)
    x_input = seq[-n_steps:]
    temp_input = np.array(x_input, dtype=float)

    predictions = []
    for i in range(prediction_days):
        x_input = np.array(temp_input, dtype=float)
        x_input = x_input.reshape((1, n_steps, n_features))
        yhat = model.predict(x_input, verbose=0)
        temp_input = np.append(temp_input, yhat)
        temp_input = temp_input[1:]
        predictions.append(yhat)
    
    predictions = np.array(predictions)
    dates = df.index
    df = df['Close']
    prev_price = df.values.astype(float)
    predictions = predictions.reshape(predictions.shape[0])
    predictions = np.concatenate((prev_price, predictions))
    dates = np.array(dates)

    return predictions, dates


def predict_sentiment():
    # HuggingFace model download can fail/timeout on some networks.
    # Return a neutral score if sentiment model isn't available.
    try:
        tokenizer, model = _get_sentiment_model()
        tokens = tokenizer.encode('Tesla is changing CEO, but', return_tensors='pt')
        result = model(tokens)
        return (torch.argmax(result.logits) + 1).item()
    except Exception:
        return 3


def technical_analysis(startdate, enddate, company):
    
    start = dt.datetime.strptime(startdate, "%Y-%m-%d")
    end = dt.datetime.strptime(enddate, "%Y-%m-%d")
    ticker = (company or "").split("-")[0].strip().upper()
    df = stockdata._fetch_history(ticker, start=start, end=end, interval="1d")
    if df is None or getattr(df, "empty", True):
        raise Exception(f"Stock data fetch failed for {ticker}")
    vol = df['Volume']

    vol = np.array(vol[-31:])
    prev_vol = vol[:30]
    curr_vol = vol[-1:]
    mean_vol = prev_vol.mean()
    ema_9 = df['Close'].ewm(span=9, adjust=False).mean()
    ema_12 = df['Close'].ewm(span=12, adjust=False).mean()
    ema_26 = df['Close'].ewm(span=26, adjust=False).mean()
    macd_line = ema_12 - ema_26
    signal_line = macd_line.ewm(span=20, adjust=False).mean()
    curr_macd = macd_line[-1:].item()
    curr_signal = signal_line[-1:].item()

    if(curr_vol >= 1.1*mean_vol and curr_macd>0 and curr_macd > curr_signal):
        tech_ans = "Buy"
    elif(curr_vol >= 1.1*mean_vol and curr_macd<0 and curr_macd < curr_signal):
        tech_ans = "Short"
    elif(curr_vol < mean_vol or curr_macd<0 or curr_macd < curr_signal):
        tech_ans = "Sell"
    elif(curr_vol < mean_vol or curr_macd>0 or curr_macd > curr_signal):
        tech_ans = "Cut Shorts"
    else:
        tech_ans = "Indecisive"

    return tech_ans;


def main(startdate, enddate, batch_size, prediction_days, company):

    predicted_prices, dates = predict_price(startdate, enddate, batch_size, prediction_days,company)
    predicted_sentiment = predict_sentiment()
    advice = technical_analysis(startdate, enddate, company)
    predicted_prices_list=predicted_prices.tolist()
    dates_list=dates.tolist()
    stock_variable_obj=stockdata.stock_variables(company)

    return_obj = {
            "predicted_prices": predicted_prices_list,
            "dates":dates_list, 
            "predicted_sentiment": predicted_sentiment, 
            "advice": advice,
            "stock":stock_variable_obj
        }
    
    return return_obj