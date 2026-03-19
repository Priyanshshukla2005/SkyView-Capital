import React from "react";
import Navbar from "../Mycomps/Navbar";
import Footerc from "../Mycomps/Footer";
import "../stylesheets/About.css";

// Use an image that actually exists in `Client/public/images/`.
const myImage = "/images/logo.svg";

function About() {
  return (
    <div>
      <Navbar />

      <div className="about-section">
        <h1>About Me</h1>
        <p>
          Hi, I'm <b>Priyansh Shukla</b>, a Computer Science Engineering student
          passionate about building efficient and innovative solutions.
        </p>

        <p>
          I specialize in <b>Frontend Development</b> and have experience working
          with HTML, CSS, JavaScript, and React. I also have knowledge of backend
          technologies like Node.js and Python.
        </p>

        <p>
          I have worked on multiple projects including AI-based systems,
          chatbot solutions, and full-stack applications. I enjoy solving
          real-world problems using technology and continuously improving my skills.
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