import React from "react";
import "../stylesheets/home.css";

function Footer() {
  return (
    <footer
      className="text-center text-lg-start text-white"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container p-4 pb-0">
        <section>
          <div className="row">

            {/* LEFT */}
            <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
              <a href="/home" style={{ textDecoration: "none", color: "inherit" }}>
                <h4 className="mb-4 font-weight-bold">
                  <img
                    src="/images/logo.svg"
                    alt="logo"
                    style={{ width: "60px" }}
                  />{" "}
                  SKYVIEW CAPITAL
                </h4>
              </a>

              <p>
                AI-powered stock prediction platform helping users make smarter
                financial decisions with data-driven insights.
              </p>
            </div>

            <hr className="w-100 clearfix d-md-none" />

            {/* LINKS */}
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">
                Useful Links
              </h6>

              <p>
                <a className="text-white" href="/home">Home</a>
              </p>
              <p>
                <a className="text-white" href="/about">About</a>
              </p>
              <p>
                <a className="text-white" href="/news">News</a>
              </p>
            </div>

            <hr className="w-100 clearfix d-md-none" />

            {/* CONTACT */}
            <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>

              <p>📍 Ghaziabad, India</p>
              <p>📧 priyanshshukla84@gmail.com</p>
            </div>

          </div>
        </section>

        <hr className="my-3" />

        {/* BOTTOM */}
        <section className="p-3 pt-0">
          <div className="row d-flex align-items-center">

            <div className="col-md-6 text-center text-md-start">
              <p style={{ margin: 0 }}>
                © 2026 SkyView Capital | Built by Priyansh Shukla
              </p>
            </div>

            {/* SOCIAL */}
            <div className="col-md-6 text-center text-md-end">
              <span style={{ marginRight: "10px" }}>Connect:</span>

              <a
                href="https://www.linkedin.com/in/priyansh-shukla-95481523a/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://www.vectorlogo.zone/logos/linkedin/linkedin-tile.svg"
                  style={{ width: "30px", marginRight: "10px" }}
                  alt="linkedin"
                />
              </a>

              <a
                href="https://github.com/Priyanshshukla2005"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://www.vectorlogo.zone/logos/github/github-tile.svg"
                  style={{ width: "30px" }}
                  alt="github"
                />
              </a>
            </div>

          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;