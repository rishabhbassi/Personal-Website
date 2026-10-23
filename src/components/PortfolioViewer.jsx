import React, { useCallback, useEffect, useRef, useState } from "react";
import portfolioPDF from "../assets/Portfolio.pdf";
import portfolioBookPDF from "../assets/Portfolio Book.pdf";
import board01 from "../assets/design-portfolio/board-01.webp";
import board01Small from "../assets/design-portfolio/board-01-sm.webp";
import board02 from "../assets/design-portfolio/board-02.webp";
import board02Small from "../assets/design-portfolio/board-02-sm.webp";
import board03 from "../assets/design-portfolio/board-03.webp";
import board03Small from "../assets/design-portfolio/board-03-sm.webp";
import board04 from "../assets/design-portfolio/board-04.webp";
import board04Small from "../assets/design-portfolio/board-04-sm.webp";
import board05 from "../assets/design-portfolio/board-05.webp";
import board05Small from "../assets/design-portfolio/board-05-sm.webp";
import board06 from "../assets/design-portfolio/board-06.webp";
import board06Small from "../assets/design-portfolio/board-06-sm.webp";
import board07 from "../assets/design-portfolio/board-07.webp";
import board07Small from "../assets/design-portfolio/board-07-sm.webp";
import board08 from "../assets/design-portfolio/board-08.webp";
import board08Small from "../assets/design-portfolio/board-08-sm.webp";
import useDialogFocus from "../hooks/useDialogFocus";
import "./PortfolioViewer.css";

const BOARDS = [
  { large: board01, small: board01Small, height: 2841 },
  { large: board02, small: board02Small, height: 2841 },
  { large: board03, small: board03Small, height: 2841 },
  { large: board04, small: board04Small, height: 2841 },
  { large: board05, small: board05Small, height: 2841 },
  { large: board06, small: board06Small, height: 2841 },
  { large: board07, small: board07Small, height: 2841 },
  { large: board08, small: board08Small, height: 2836 },
];

const BOARD_SIZES =
  "(max-width: 700px) calc(100vw - 32px), min(1120px, calc(100vw - 80px))";

export default function PortfolioViewer({ onClose }) {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const showDownloadRef = useRef(false);

  useEffect(() => {
    showDownloadRef.current = showDownloadOptions;
  }, [showDownloadOptions]);

  const requestClose = useCallback(() => {
    if (showDownloadRef.current) {
      setShowDownloadOptions(false);
      return;
    }
    onClose();
  }, [onClose]);

  const dialogRef = useDialogFocus(requestClose);

  // Close the download menu when the pointer lands elsewhere.
  useEffect(() => {
    if (!showDownloadOptions) return undefined;

    const handleClickOutside = (event) => {
      if (!event.target.closest(".portfolio-download-wrapper")) {
        setShowDownloadOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDownloadOptions]);

  return (
    <div
      className="portfolio-viewer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-viewer-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <header className="portfolio-viewer-header">
        <button
          type="button"
          className="portfolio-back-button"
          onClick={onClose}
          data-autofocus
        >
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="portfolio-viewer-heading">
          <p className="portfolio-viewer-kicker">Design / Web edition</p>
          <h1 className="portfolio-viewer-title" id="portfolio-viewer-title">
            Selected portfolio
          </h1>
        </div>

        <div className="portfolio-viewer-controls">
          <p className="portfolio-viewer-count">08 boards</p>
          <div className="portfolio-download-wrapper">
            <button
              type="button"
              className="portfolio-download-button"
              onClick={() => setShowDownloadOptions((open) => !open)}
              aria-expanded={showDownloadOptions}
              aria-controls="portfolio-download-options"
            >
              Download
              <svg viewBox="0 0 12 8" aria-hidden="true">
                <path d="M1 1.5 6 6.5l5-5" />
              </svg>
            </button>

            {showDownloadOptions ? (
              <div
                className="portfolio-download-options"
                id="portfolio-download-options"
                aria-label="Download options"
              >
                <a
                  href={portfolioPDF}
                  download="Rishabh_Bassi_Portfolio.pdf"
                  onClick={() => setShowDownloadOptions(false)}
                >
                  Portfolio board
                  <span>PDF · 25.8 MB</span>
                </a>
                <a
                  href={portfolioBookPDF}
                  download="Rishabh_Bassi_Portfolio_Book.pdf"
                  onClick={() => setShowDownloadOptions(false)}
                >
                  Portfolio book
                  <span>PDF · 12.1 MB</span>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div
        className="portfolio-viewer-content"
        tabIndex={0}
        role="region"
        aria-label="Design portfolio board. Scroll to read."
        aria-describedby="portfolio-viewer-description"
      >
        <p className="sr-only" id="portfolio-viewer-description">
          A visual portfolio board. This web edition displays the board as
          images; the original full-resolution document is available through
          the download menu.
        </p>

        <div className="portfolio-board">
          {BOARDS.map((board, index) => (
            <img
              key={board.large}
              className="portfolio-board-slice"
              src={board.large}
              srcSet={`${board.small} 800w, ${board.large} 1400w`}
              sizes={BOARD_SIZES}
              width="1400"
              height={board.height}
              alt={`Design portfolio board, section ${index + 1} of ${BOARDS.length}`}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
          ))}
        </div>

        <footer className="portfolio-viewer-end">
          <p>End of board / Rishabh Bassi</p>
          <div>
            <a href={portfolioPDF} download="Rishabh_Bassi_Portfolio.pdf">
              Download PDF <span aria-hidden="true">↓</span>
            </a>
            <button type="button" onClick={onClose}>
              Back to work <span aria-hidden="true">↑</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
