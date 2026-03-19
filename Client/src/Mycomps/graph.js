import React, { useEffect, useState } from "react";
import "../stylesheets/graph.css";
import axios from "axios";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import Table from "react-bootstrap/Table";
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export default function Graph(props) {
 if (!props || !props.graphDataPoints) {
  return <div>Loading...</div>;
}

if (props.graphDataPoints.length === 0) {
  return <div>No data available for this stock</div>;
}
  const dataPoints = props.graphDataPoints;
  const stock = props.stockVariables || {};
  const options = {
    title: {
      text: `${props.stock} Stock Prices`,
    },
    charts: [
      {
        data: [
          {
            type: "line",
            dataPoints: dataPoints,
          },
        ],
      },
    ],
    navigator: {
      slider: {
        minimum: new Date("1990-01-01"),
        maximum: new Date("2024-01-01"),
      },
    },
  };

  return (

    <div style={{ alignContent: "center" }}>
      <br></br>
      <br></br>

      <CanvasJSStockChart options={options} />
      <br></br>
      <br></br>
      <h3>Basic Company Financials: {props.stock}</h3>
      <br></br>

      <div style={{ paddingLeft: "12rem" }}>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Financial Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
  <tr>
    <td>52 Week High</td>
    <td>$ {stock?.high || 0}</td>
  </tr>
  <tr>
    <td>52 Week Low</td>
    <td>$ {stock?.low || 0}</td>
  </tr>
  <tr>
    <td>Previous Close</td>
    <td>$ {stock?.prev_close || 0}</td>
  </tr>
  <tr>
    <td>52 Week Returns</td>
    <td>$ {stock?.returns || 0}</td>
  </tr>
  <tr>
    <td>Average Volume</td>
    <td>$ {stock?.avg_volume || 0} M</td>
  </tr>
  <tr>
    <td>Prev day High</td>
    <td>$ {stock?.high_prev || 0}</td>
  </tr>
  <tr>
    <td>Prev day Low</td>
    <td>$ {stock?.low_prev || 0}</td>
  </tr>
  <tr>
    <td>Market Cap</td>
    <td>$ {stock?.market_cap || 0} T</td>
  </tr>
</tbody>
        </Table>
      </div>
    </div>
  );
}
