import React, { useState, useEffect } from "react";
import "../stylesheets/predbyinp.css";
import Graph from "./graph";
import { CirclesWithBar } from "react-loader-spinner";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

function setProperGraphData(dates, predictions) {
  let dummyPoints = [];

  let nanosecondsValue, millisecondsValue, date;
  for (let a = 0; a < dates.length; a++) {
    nanosecondsValue = dates[a];
    millisecondsValue = nanosecondsValue / 1000000; // Convert nanoseconds to milliseconds
    date = new Date(millisecondsValue);

    let dummyPoint = {
      x: new Date(date),
      y: predictions[a],
    };
    dummyPoints.push(dummyPoint);
  }

  let extra = predictions.length - dates.length;
  console.log(dummyPoints)

  for (let i = 0; i < extra; i++) {
    let prediction = predictions[dates.length + i];
    nanosecondsValue += 24 * 60 * 60 * 1000 * 1000000;
    millisecondsValue = nanosecondsValue / 1000000; // Convert nanoseconds to milliseconds
    date = new Date(millisecondsValue);
    while (date.getDay()===0 || date.getDay()===6) {
      nanosecondsValue += 24 * 60 * 60 * 1000 * 1000000;
      millisecondsValue = nanosecondsValue / 1000000; // Convert nanoseconds to milliseconds
      date = new Date(millisecondsValue);
    }
    console.log(date.getDay)
    let dummyPoint = {
      x: new Date(date),
      y: prediction,
    };

    // console.log(dummyPoint);
    dummyPoints.push(dummyPoint);
  }
  console.log(dummyPoints)
  // console.log(a)
  // console.log(dummyPoints);
  return dummyPoints;
}

function ShowPredictions({ advice, sentiment, splicedArray }) {
  return (
    <div>
      <Card border="white" className="bg-dark text-white">
        <Card.Header>Advice</Card.Header>
        <Card.Body>
          The Advice based on our Model's Prediction is:<b> {advice}</b>
        </Card.Body>
      </Card>
      <Card border="white" className="bg-dark text-white">
        <Card.Header>Sentiment Analysis</Card.Header>
        <Card.Body>
          The Sentiment based on our Model's Sentiment Analysis Report is:
          <b> {sentiment}/5</b>
        </Card.Body>
      </Card>
      <Card border="white" className="bg-dark text-white">
        <Card.Header>Predicted Data</Card.Header>
        <Card.Body>
          The Predicted Future Data based on our Model's Report
        </Card.Body>
        <div>
          <Table striped bordered hover variant={"secondary"}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {splicedArray.map((object) => (
                <tr key={object.id}>
                  <td>{object.x.toDateString()}</td>
                  <td>${object.y.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

export default function PredByInput(props) {
  const [startDate, setStartDate] = useState("");
  const [company, setCompany] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [graphDataPoints, setGraphDataPoints] = useState([]);
  const [advice, setAdvice] = useState("");
  const [sentiment, setSentiment] = useState(0);
  const [predictions, setPredictions] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [stockVariables, setStockVariables] = useState(null);
  const [splicedArray, setSplicedArray] = useState([]);
  const [error, setError] = useState("");

  let token = localStorage.getItem("token");
  token = token.replace(/"/g, ""); // This will remove all double quotes in the string

  const handleStartChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
  };

  const handleClear = () => {
    setIsSubmitted(false);
    setError("");
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!company || !startDate) {
      setError("Please select a stock and a date.");
      setIsSubmitted(true);
      setLoading(false);
      return;
    }

    // The UI "Select a Date" is treated as the end date for fetching history.
    // Use a 1-year window ending at the selected date to train/compute indicators.
    const endDate = startDate;
    const start = new Date(endDate);
    start.setFullYear(start.getFullYear() - 1);
    const historyStartDate = start.toISOString().slice(0, 10); // YYYY-MM-DD

    const data = {
      startDate: historyStartDate,
      endDate: endDate,
      company: company,
      days: numberOfDays,
    };

    setIsSubmitted(true);
    setError("");

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/v1/ml/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the Content-Type here
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        setPredictions(data);
        // console.log(data);
        setAdvice(data.advice);
        setSentiment(data.predicted_sentiment);
        setGraphData(data.predicted_prices);
        setDates(data.dates);
        // setProperData(startDate, endDate, data.predicted_prices)
        setStockVariables(data.stock);
        setGraphDataPoints(
          setProperGraphData(data.dates, data.predicted_prices)
        );
        setSplicedArray(
          setProperGraphData(data.dates, data.predicted_prices).slice(
            -numberOfDays
          )
        );

        setLoading(false);
      } else {
        let msg = `Request failed: ${response.status} ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (errJson?.message) msg = errJson.message;
          else if (errJson?.error && errJson?.detail) msg = `${errJson.error}: ${errJson.detail}`;
          else if (errJson?.error) msg = errJson.error;
        } catch {}
        setError(msg);
        setLoading(false);
        console.log(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message || "Request failed");
      console.log(`Error: ${error.message}`);
    }
  };
  const handleIncreaseDays = () => {
    if (numberOfDays < 50) {
      setNumberOfDays(numberOfDays + 1);
    }
  };

  const handleDecreaseDays = () => {
    if (numberOfDays > 1) {
      setNumberOfDays(numberOfDays - 1);
    }
  };

  return (
    <div className="predict-container">
      <h2>Predict the Movement of the Stock</h2>
      <p>by providing the input</p>
      <div className="makeGrid">
        <div className="form-group">
          <label>Select a Stock:</label>
          <select value={company} onChange={handleCompanyChange}>
            <option value="">Select a stock</option>
            <option value="AAPL">Apple Inc.</option>
            <option value="GOOGL">Alphabet Inc.</option>
            <option value="MSFT">Microsoft Inc.</option>
            <option value="AMZN">Amazon Inc.</option>
            <option value="NVDA">Nvidia Inc.</option>
          </select>
        </div>

        <div className="form-group">
          <label>Select a Date:</label>
          <input type="date" value={startDate} onChange={handleStartChange} />
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-full h-2 bg-gray-800 rounded-full"></div>
        <div className="form-group">
          <label>Number of Days:</label>
          <div className="number-input">
            <button onClick={handleDecreaseDays}>-</button>
            <input type="number" value={numberOfDays} readOnly />
            <button onClick={handleIncreaseDays}>+</button>
          </div>
        </div>
      </div>
      {isSubmitted ? (
        <div style={{ justifyContent: "center" }}>
          <button onClick={handleClear}>Clear</button>
          {loading ? (
            <div className="MakeCenter">
              <CirclesWithBar
                height="100"
                width="100"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                outerCircleColor=""
                innerCircleColor=""
                barColor=""
                ariaLabel="circles-with-bar-loading"
              />
            </div>
          ) : (
            <div>
              {error ? (
                <Card border="danger" className="bg-dark text-white">
                  <Card.Header>Prediction Error</Card.Header>
                  <Card.Body>{error}</Card.Body>
                </Card>
              ) : null}
              <div className="predictedData">
                <br></br>
                <ShowPredictions
                  advice={advice}
                  sentiment={sentiment}
                  splicedArray={splicedArray}
                />
              </div>
              <Graph
                stock={company}
                graphDataPoints={graphDataPoints}
                stockVariables={stockVariables}
              />
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleClick}>Predict</button>
      )}
    </div>
  );
}
