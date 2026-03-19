from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import time
import engine
import stockdata
load_dotenv()

app = Flask(__name__)             

@app.route("/")                   
def hello():                      
    return "Hello World!"  

@app.route("/ping")                   
def yo():                      
    return "pong"  

@app.route("/model", methods=["POST"])
def predict(): 
    secretKey=request.headers.get('Token')
    expected = os.getenv('SERVER_SECRET')
    if(not expected or secretKey!=expected):
        print("NOT VERIFIED")
        return jsonify({"error": "invalid request"}), 401
    else:
        print("VERIFIED")
        print(request.get_data())
        # data=request.get_json()
        payload = request.get_json() or {}
        company = payload.get('company')
        startDate = payload.get('startDate')
        endDate = payload.get('endDate')
        days = payload.get('days')
        # duration=request.get_json()['duration']
        #Date- YYYY-MM-DD
        #yaha par processing kar and data bhej
        if not company or not startDate or not endDate or not days:
            return jsonify({"error": "missing required fields"}), 400

        ticker=company.split('-')[0]
        prediction_days = int(days)
        batch_size = 7
        print("startDate", startDate)
        print("endDate", endDate)
        try:
            return_obj = engine.main(str(startDate), str(endDate), batch_size, prediction_days, str(ticker))
            print(return_obj)
            return jsonify(return_obj)
        except Exception as e:
            return jsonify({"error": "model failed", "detail": str(e)}), 500
    
@app.route("/search", methods=["POST"])                   
def search():                      
    company = request.get_json()['company']
    return jsonify(stockdata.stock_data(company))

if __name__ == "__main__":        
    # Disable the reloader: importing heavy libs (tensorflow/transformers) can trigger
    # watchdog reloads on Windows, which resets in-flight requests.
    app.run(debug=False, port=6969, use_reloader=False, threaded=True)