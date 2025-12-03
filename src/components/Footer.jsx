import React, { useState, useEffect } from "react";
import "./Footer.css";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      };
      const formattedTime = now.toLocaleTimeString("en-US", options);
      setTime(formattedTime);
    }

    updateTime();

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      id="contact"
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#131313ff",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "3rem 15vw",
        boxSizing: "border-box",
        fontFamily: "'Dennis Sans', sans-serif",
        textAlign: "left",
      }}
      className="footer-container"
    >
      {/* Large heading and arrow */}
      <div style={{ display: "flex", alignItems: "anchor-center", justifyContent: "space-between", gap: "1rem" }} className="footer-heading-wrapper">
        <h2 style={{ fontWeight: 400, fontSize: "4rem", marginBottom: "1rem", marginTop: 0 }} className="footer-heading">
          Let's Build Something Great Together
        </h2>

        <svg
          width="30"
          height="30"
          viewBox="0 0 20 10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          style={{ flexShrink: 0, transform: "rotate(180deg)", marginTop: "0.5rem" }}
          className="footer-arrow"
        >
          <polyline points="2.769 0 12 0 12 9.23" />
          <line x1="12" y1="0" x2="0" y2="12" />
        </svg>
      </div>

      {/* Line with button */}
      <div style={{ width: "100%" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            marginTop: "5rem",
            marginBottom: "3rem",
            height: "2px",
            backgroundColor: "#919191ff",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-84px",
              right: "2rem",
              width: "170px",
              height: "170px",
              borderRadius: "50%",
              background: "linear-gradient(to top, #5d0dffff 50%, #fff 50%)",
              backgroundSize: "100% 200%",
              backgroundPosition: "bottom",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Dennis Sans', sans-serif",
              fontWeight: "300",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-position 0.4s ease-in-out, color 0.4s ease",
              zIndex: 2,
            }}
            className="footer-contact-button"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundPosition = "top";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundPosition = "bottom";
              e.currentTarget.style.color = "#fff";
            }}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openContactPopup'));
            }}
          >
            Get in touch
          </div>
        </div>
      </div>

      {/* Email + Phone buttons */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "2rem" }} className="footer-contact-buttons">
        <a
          href="mailto:rishabhb.career@gmail.com"
          className = "pill-button"
        >
          rishabhb.career@gmail.com
        </a>

        <a
          href="tel:+918529177707"
          className = "pill-button"
        >
          +91 8529177707
        </a>

      </div>

      {/* Bottom metadata row */}
      <div
        style={{
          position: "relative",
          left: "calc(-15vw)",
          width: "calc(94vw)",
          padding: "0rem 3vw",
          marginBottom: "-15px",
          marginTop: "auto",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "1rem",
        }}
        className="footer-metadata"
      >
        <div style={{ display: "flex", gap: "3rem", alignItems: "center" }} className="footer-metadata-left">
          <div>
            <div
              style={{
                color: "#919191ff",
                fontWeight: "300",
                marginBottom: "0.3rem",
                fontSize: "0.8rem",
              }}
            >
              VERSION
            </div>
            <div style={{ fontWeight: "400" }}>2025 &copy; Edition</div>
          </div>

          <div>
            <div
              style={{
                color: "#919191ff",
                fontWeight: "300",
                marginBottom: "0.3rem",
                fontSize: "0.8rem",
              }}
            >
              LOCAL TIME
            </div>
            <div style={{ fontWeight: "400" }}>{time}</div>
          </div>
        </div>

        <div className="footer-metadata-right">
          <div
            style={{
              color: "#919191ff",
              fontWeight: "300",
              marginBottom: "0.3rem",
              fontSize: "0.8rem",
            }}
          >
            SOCIALS
          </div>
          <div style={{ display: "flex", gap: "2rem", fontWeight: "700" }} className="footer-socials">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#fff",
                textDecoration: "none",
                borderBottom: "2px solid transparent",
                transition: "border-bottom 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderBottom = "2px solid #fff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderBottom = "2px solid transparent")
              }
            >
              Instagram
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#fff",
                textDecoration: "none",
                borderBottom: "2px solid transparent",
                transition: "border-bottom 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderBottom = "2px solid #fff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderBottom = "2px solid transparent")
              }
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/rishabh-bassi-5981a9223/"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#fff",
                textDecoration: "none",
                borderBottom: "2px solid transparent",
                transition: "border-bottom 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderBottom = "2px solid #fff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderBottom = "2px solid transparent")
              }
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
