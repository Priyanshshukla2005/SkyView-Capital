import React from "react";
import Navbar from "../Mycomps/Navbar";
import Footerc from "../Mycomps/Footer";
import "../stylesheets/About.css";

// Use an image that actually exists in `Client/public/images/`.
const myImage = "/images/priyansh.png";

function About() {
  return (
    <div>
      <Navbar />

      <div className="about-section">
        <h1>About Project</h1>
        <p>
          SkyView Capital is an AI-powered stock prediction system that leverages LSTM neural networks, BERT-based sentiment analysis, and technical indicators to forecast stock price movements. 
        </p>

        <p>
          It integrates machine learning with a full-stack web application to provide insights into market trends.
        </p>
      </div>

      <h2 style={{ textAlign: "center", fontSize: "35px", color: "white" }}>
        <br />
        About Developer
        <br />
        <br />
      </h2>

      <div className="row" style={{ justifyContent: "center" }}>
        <div className="column">
          <div className="card">
            <img
              src={myImage}
              alt="Priyansh"
              style={{ width: "80%", alignSelf: "center" }}
            />

            <div className="container" style={{ textAlign: "center" }}>
              <h2>Priyansh Shukla</h2>
              <p className="title">Frontend Developer</p>

              <p>
                Passionate developer focused on building modern web applications,
                AI-based solutions, and user-friendly interfaces.
              </p>

              <p>priyanshshukla84@gmail.com</p>

              <a
                href="https://www.linkedin.com/in/priyansh-shukla-95481523a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="button">Contact</button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footerc />
    </div>
  );
}

export default About;