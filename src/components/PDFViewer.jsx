import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import portfolioPDF from "../assets/Portfolio.pdf";
import portfolioBookPDF from "../assets/Portfolio Book.pdf";
import useDialogFocus from "../hooks/useDialogFocus";
import "./PDFViewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PDFViewer({
  isOpen,
  onClose,
  pdfUrl,
  title = "Design",
  downloadFileName,
}) {
  const [totalPages, setTotalPages] = useState(0);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [showPreparing, setShowPreparing] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const canvasRefs = useRef([]);
  const pagesRef = useRef(null);
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

  const activePdf = pdfUrl || portfolioPDF;
  const downloadName =
    downloadFileName ||
    (title === "Design" ? "Rishabh_Bassi_Portfolio.pdf" : `${title}.pdf`);

  // Close the download popover when the pointer lands elsewhere.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDownloadOptions && !event.target.closest(".pdf-download-wrapper")) {
        setShowDownloadOptions(false);
      }
    };

    if (showDownloadOptions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [showDownloadOptions]);

  // Load the document and reset the viewer when it closes.
  useEffect(() => {
    if (!isOpen) {
      setPdfDoc(null);
      setTotalPages(0);
      setIsLoading(false);
      setIsRendering(false);
      setLoadError(null);
      setShowDownloadOptions(false);
      canvasRefs.current = [];
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setIsRendering(false);
    setLoadError(null);
    setPdfDoc(null);
    setTotalPages(0);
    canvasRefs.current = [];

    const loadingTask = pdfjsLib.getDocument({
      url: activePdf,
      withCredentials: false,
    });

    loadingTask.promise
      .then((document) => {
        if (cancelled) {
          document.destroy();
          return;
        }
        setPdfDoc(document);
        setTotalPages(document.numPages);
        setIsRendering(true);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError("The document could not be opened.");
        setIsLoading(false);
        setIsRendering(false);
      });

    return () => {
      cancelled = true;
      loadingTask.destroy().catch(() => {});
    };
  }, [isOpen, activePdf, loadAttempt]);

  const getPageWidth = useCallback(() => {
    const container = pagesRef.current;
    if (!container) {
      return Math.min(window.innerWidth, 1120);
    }
    const styles = window.getComputedStyle(container);
    const horizontalPadding =
      (Number.parseFloat(styles.paddingLeft) || 0) +
      (Number.parseFloat(styles.paddingRight) || 0);
    return Math.max(240, Math.min(container.clientWidth - horizontalPadding, 1120));
  }, []);

  // PDF.js throws if a canvas is rendered twice concurrently, so renders are
  // serialised per canvas. The output scale is capped for long documents to
  // keep memory use predictable.
  const renderPage = useCallback(
    async (pdfDocument, pageNum) => {
      const canvas = canvasRefs.current[pageNum - 1];
      if (!pdfDocument || !canvas || pageNum < 1) return;

      const previous = canvas.__renderChain ?? Promise.resolve();
      const next = previous
        .catch(() => {})
        .then(async () => {
          if (!canvas.isConnected) return;

          const page = await pdfDocument.getPage(pageNum);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = getPageWidth() / baseViewport.width;
          const viewport = page.getViewport({ scale });
          const context = canvas.getContext("2d");
          if (!context) return;

          const outputScale =
            pdfDocument.numPages <= 4 && viewport.height <= viewport.width * 3
              ? Math.min(window.devicePixelRatio || 1, 2)
              : 1;

          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);

          await page.render({
            canvasContext: context,
            viewport,
            transform:
              outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : undefined,
          }).promise;
        })
        .catch(() => {
          // A single failed page should not blank the whole document.
        });

      canvas.__renderChain = next;
      return next;
    },
    [getPageWidth],
  );

  const renderAllPages = useCallback(
    async (pdfDocument) => {
      const pages = Array.from({ length: pdfDocument.numPages }, (_, index) =>
        renderPage(pdfDocument, index + 1),
      );
      await Promise.all(pages);
    },
    [renderPage],
  );

  // Render once the document and canvas elements are in the DOM.
  useEffect(() => {
    if (!isOpen || !pdfDoc) return undefined;
    let cancelled = false;

    const frame = window.requestAnimationFrame(() => {
      renderAllPages(pdfDoc).then(() => {
        if (!cancelled) {
          setIsRendering(false);
        }
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen, pdfDoc, renderAllPages]);

  // Keep quick documents flash-free: only show the preparing state when
  // rendering is actually taking long enough to be noticed.
  useEffect(() => {
    if (!isRendering) {
      setShowPreparing(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setShowPreparing(true), 280);
    return () => window.clearTimeout(timer);
  }, [isRendering]);

  // Re-render on width changes only, after a short debounce.
  useEffect(() => {
    if (!isOpen || !pdfDoc) return undefined;
    let timeoutId;
    let lastWidth = 0;

    const handleResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const nextWidth = getPageWidth();
        if (nextWidth === lastWidth) return;
        lastWidth = nextWidth;
        setIsRendering(true);
        renderAllPages(pdfDoc).then(() => setIsRendering(false));
      }, 180);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [getPageWidth, isOpen, pdfDoc, renderAllPages]);

  if (!isOpen) return null;

  const showLoading = (isLoading || !pdfDoc) && !loadError;

  return (
    <div
      className="pdf-viewer-page"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <header className="pdf-viewer-header">
        <button
          type="button"
          className="pdf-back-button"
          onClick={onClose}
          data-autofocus
        >
          <span aria-hidden="true">←</span> Back
        </button>

        <h1 className="pdf-viewer-title" id="pdf-viewer-title" title={title}>
          {title}
        </h1>

        <div className="pdf-viewer-controls">
          {totalPages > 0 && !loadError ? (
            <p className="pdf-page-count" aria-live="polite">
              {isRendering ? "Rendering…" : `${totalPages} pages`}
            </p>
          ) : null}

          <div className="pdf-download-wrapper">
            <button
              type="button"
              className="pdf-download-button"
              onClick={() => setShowDownloadOptions((open) => !open)}
              aria-expanded={showDownloadOptions}
              aria-controls="pdf-download-options"
            >
              Download
              <svg viewBox="0 0 12 8" aria-hidden="true">
                <path d="M1 1.5 6 6.5l5-5" />
              </svg>
            </button>

            {showDownloadOptions ? (
              <div
                className="download-options"
                id="pdf-download-options"
                aria-label="Download options"
              >
                <a
                  className="download-option-button"
                  href={activePdf}
                  download={downloadName}
                  onClick={() => setShowDownloadOptions(false)}
                >
                  Download PDF
                  <span aria-hidden="true">↓</span>
                </a>
                {!pdfUrl ? (
                  <a
                    className="download-option-button"
                    href={portfolioBookPDF}
                    download="Rishabh_Bassi_Portfolio_Book.pdf"
                    onClick={() => setShowDownloadOptions(false)}
                  >
                    Download book format
                    <span aria-hidden="true">↓</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div
        className={`pdf-viewer-content${showPreparing ? " is-preparing" : ""}`}
        aria-busy={showLoading || isRendering}
        tabIndex={0}
        role="region"
        aria-label="Document pages. Scroll to read."
      >
        {showLoading ? (
          <div className="pdf-state" role="status" aria-live="polite">
            <span className="pdf-spinner" aria-hidden="true" />
            <p className="pdf-state-kicker">Document viewer</p>
            <h2>Opening {title}…</h2>
            <p>Preparing the pages for reading.</p>
          </div>
        ) : loadError ? (
          <div className="pdf-state pdf-state-error" role="alert">
            <p className="pdf-state-kicker">Document unavailable</p>
            <h2>This PDF couldn&apos;t be opened.</h2>
            <p>
              The file may be temporarily unavailable. Try again, or head back
              to the portfolio.
            </p>
            <div className="pdf-state-actions">
              <button
                type="button"
                className="pdf-state-primary"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
              >
                Try again
              </button>
              <button type="button" className="pdf-state-secondary" onClick={onClose}>
                Back to portfolio
              </button>
            </div>
          </div>
        ) : (
          <>
            {showPreparing ? (
              <div className="pdf-preparing" role="status" aria-live="polite">
                <span className="pdf-preparing-kicker">Preparing document</span>
                <span className="pdf-preparing-track" aria-hidden="true">
                  <span className="pdf-preparing-bar" />
                </span>
                <p className="pdf-preparing-note">
                  Large documents can take a few seconds to draw.
                </p>
              </div>
            ) : null}
            <div className="pdf-pages" ref={pagesRef}>
              {Array.from({ length: totalPages }, (_, index) => (
                <div
                  key={`page-${index + 1}`}
                  className="pdf-page-wrapper"
                  role="group"
                  aria-label={`Page ${index + 1} of ${totalPages}`}
                >
                  <canvas
                    ref={(element) => {
                      canvasRefs.current[index] = element;
                    }}
                    className="pdf-page-canvas"
                  />
                  <span className="pdf-page-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(totalPages).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
