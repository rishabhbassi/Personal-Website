import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import portfolioPDF from "../assets/Portfolio.pdf";
import portfolioBookPDF from "../assets/Portfolio Book.pdf";
import useDialogFocus from "../hooks/useDialogFocus";
import "./PDFViewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const THUMB_RAIL_QUERY = "(min-width: 1100px)";
const THUMB_RENDER_WIDTH = 120;

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function pageLabel(page, total) {
  return `${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

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
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [progress, setProgress] = useState(0);
  const [thumbsEnabled, setThumbsEnabled] = useState(false);
  const canvasRefs = useRef([]);
  const thumbCanvasRefs = useRef([]);
  const thumbButtonRefs = useRef([]);
  const pageWrapperRefs = useRef([]);
  const pagesRef = useRef(null);
  const contentRef = useRef(null);
  const currentPageRef = useRef(1);
  const thumbsRenderedRef = useRef(null);
  const scrollFrameRef = useRef(0);
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

  // Thumbnails are a desktop affordance. The rail hides well before the
  // header runs out of room, and this keeps phone-sized loads from rendering
  // a second copy of every page.
  useEffect(() => {
    const media = window.matchMedia?.(THUMB_RAIL_QUERY);
    if (!media) return undefined;

    const update = () => setThumbsEnabled(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

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
      setCurrentPage(1);
      setZoom(1);
      setProgress(0);
      currentPageRef.current = 1;
      thumbsRenderedRef.current = null;
      canvasRefs.current = [];
      thumbCanvasRefs.current = [];
      thumbButtonRefs.current = [];
      pageWrapperRefs.current = [];
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setIsRendering(false);
    setLoadError(null);
    setPdfDoc(null);
    setTotalPages(0);
    setCurrentPage(1);
    setZoom(1);
    setProgress(0);
    currentPageRef.current = 1;
    thumbsRenderedRef.current = null;
    canvasRefs.current = [];
    thumbCanvasRefs.current = [];
    thumbButtonRefs.current = [];
    pageWrapperRefs.current = [];

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
    const sheet = pagesRef.current;
    if (!sheet) {
      return Math.min(window.innerWidth, 1120);
    }
    const styles = window.getComputedStyle(sheet);
    const horizontalPadding =
      (Number.parseFloat(styles.paddingLeft) || 0) +
      (Number.parseFloat(styles.paddingRight) || 0);
    // Measure the reading viewport rather than the sheet: the sheet grows with
    // the zoom control, while the canvas bitmap should keep its base size.
    const available = (sheet.parentElement?.clientWidth ?? window.innerWidth) -
      horizontalPadding;
    return Math.max(240, Math.min(available, 1120));
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

  const syncScrollState = useCallback(() => {
    const content = contentRef.current;
    const wrappers = pageWrapperRefs.current.filter(Boolean);
    if (!content || wrappers.length === 0) return;

    const contentTop = content.getBoundingClientRect().top;
    const readingLine = contentTop + Math.min(content.clientHeight * 0.32, 190);
    let active = 1;

    wrappers.forEach((wrapper, index) => {
      if (wrapper.getBoundingClientRect().top <= readingLine) {
        active = index + 1;
      }
    });

    currentPageRef.current = active;
    setCurrentPage((previous) => (previous === active ? previous : active));

    const maxScroll = content.scrollHeight - content.clientHeight;
    setProgress(
      maxScroll > 4
        ? Math.min(1, Math.max(0, content.scrollTop / maxScroll))
        : 0,
    );
  }, []);

  const goToPage = useCallback(
    (page) => {
      const content = contentRef.current;
      const next = Math.max(1, Math.min(totalPages || 1, page));
      const wrapper = pageWrapperRefs.current[next - 1];
      if (!content || !wrapper) return;

      const top =
        wrapper.getBoundingClientRect().top -
        content.getBoundingClientRect().top +
        content.scrollTop -
        18;

      content.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      currentPageRef.current = next;
      setCurrentPage(next);
    },
    [totalPages],
  );

  const zoomIn = useCallback(() => {
    setZoom((current) => {
      const index = ZOOM_LEVELS.indexOf(current);
      const next = ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, index + 1)];
      return next ?? current;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((current) => {
      const index = ZOOM_LEVELS.indexOf(current);
      const next = ZOOM_LEVELS[Math.max(0, index - 1)];
      return next ?? current;
    });
  }, []);

  const resetZoom = useCallback(() => setZoom(1), []);

  // Render once the document and canvas elements are in the DOM.
  useEffect(() => {
    if (!isOpen || !pdfDoc) return undefined;
    let cancelled = false;

    const frame = window.requestAnimationFrame(() => {
      renderAllPages(pdfDoc).then(() => {
        if (!cancelled) {
          setIsRendering(false);
          syncScrollState();
        }
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen, pdfDoc, renderAllPages, syncScrollState]);

  // Small page previews, rendered once per document and only when the rail is
  // visible. They share the same PDF document but their own canvases.
  useEffect(() => {
    if (!isOpen || !pdfDoc || pdfDoc.numPages < 2) return undefined;
    if (!thumbsEnabled) {
      // The rail unmounts its canvases, so a later resize back to desktop
      // needs a fresh render rather than reusing the old marker.
      thumbsRenderedRef.current = null;
      return undefined;
    }
    if (thumbsRenderedRef.current === pdfDoc) return undefined;

    let cancelled = false;
    thumbsRenderedRef.current = pdfDoc;
    const deviceScale = Math.min(window.devicePixelRatio || 1, 2);

    const frame = window.requestAnimationFrame(async () => {
      for (let index = 0; index < pdfDoc.numPages; index += 1) {
        if (cancelled) return;
        const canvas = thumbCanvasRefs.current[index];
        if (!canvas) continue;

        try {
          const page = await pdfDoc.getPage(index + 1);
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({
            scale: (THUMB_RENDER_WIDTH * deviceScale) / base.width,
          });
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          await page.render({ canvasContext: context, viewport }).promise;
        } catch {
          // A missing thumbnail is cosmetic; the page itself still renders.
        }
      }
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen, pdfDoc, thumbsEnabled]);

  // Keep the active thumbnail in view as the reader scrolls.
  useEffect(() => {
    if (!thumbsEnabled) return;
    thumbButtonRefs.current[currentPage - 1]?.scrollIntoView({
      block: "nearest",
    });
  }, [currentPage, thumbsEnabled]);

  // Track the reading position without running layout work on every frame.
  useEffect(() => {
    const content = contentRef.current;
    if (!isOpen || !pdfDoc || !content) return undefined;

    const handleScroll = () => {
      if (scrollFrameRef.current) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = 0;
        syncScrollState();
      });
    };

    content.addEventListener("scroll", handleScroll, { passive: true });
    syncScrollState();

    return () => {
      content.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = 0;
      }
    };
  }, [isOpen, pdfDoc, syncScrollState]);

  // Changing the zoom changes every page's height, so keep the reader on the
  // page they were just looking at.
  useEffect(() => {
    if (!pdfDoc) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const content = contentRef.current;
      const wrapper = pageWrapperRefs.current[currentPageRef.current - 1];
      if (!content || !wrapper) return;

      const top =
        wrapper.getBoundingClientRect().top -
        content.getBoundingClientRect().top +
        content.scrollTop -
        18;
      content.scrollTop = Math.max(0, top);
      syncScrollState();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pdfDoc, zoom, syncScrollState]);

  // PageUp/PageDown and the arrow keys scroll the document; plus/minus gives
  // keyboard users the same zoom controls as the buttons.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomOut();
      } else if (event.key === "0") {
        event.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, resetZoom, zoomIn, zoomOut]);

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
        renderAllPages(pdfDoc).then(() => {
          setIsRendering(false);
          syncScrollState();
        });
      }, 180);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [getPageWidth, isOpen, pdfDoc, renderAllPages, syncScrollState]);

  if (!isOpen) return null;

  const showLoading = (isLoading || !pdfDoc) && !loadError;
  const showDocument = totalPages > 0 && !loadError && !showLoading;
  const showThumbs = showDocument && thumbsEnabled && totalPages > 1;
  const canZoomOut = zoom > ZOOM_LEVELS[0];
  const canZoomIn = zoom < ZOOM_LEVELS[ZOOM_LEVELS.length - 1];

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
          {showDocument && totalPages > 1 ? (
            <div className="pdf-page-nav" aria-label="Page navigation">
              <button
                type="button"
                className="pdf-icon-button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
              >
                <span aria-hidden="true">←</span>
              </button>
              <p className="pdf-page-count" aria-live="polite">
                {pageLabel(currentPage, totalPages)}
              </p>
              <button
                type="button"
                className="pdf-icon-button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}

          {showDocument ? (
            <div className="pdf-zoom-controls" aria-label="Zoom">
              <button
                type="button"
                className="pdf-icon-button"
                onClick={zoomOut}
                disabled={!canZoomOut}
                aria-label="Zoom out"
              >
                <span aria-hidden="true">−</span>
              </button>
              <button
                type="button"
                className="pdf-zoom-value"
                onClick={resetZoom}
                title="Fit to width"
                aria-label={`Zoom ${Math.round(zoom * 100)} percent. Reset to fit width.`}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                className="pdf-icon-button"
                onClick={zoomIn}
                disabled={!canZoomIn}
                aria-label="Zoom in"
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
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
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowDownloadOptions(false)}
                >
                  Open in new tab
                  <span aria-hidden="true">↗</span>
                </a>
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

      {showDocument && totalPages > 1 ? (
        <div className="pdf-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      ) : null}

      <div className="pdf-viewer-body">
        {showThumbs ? (
          <aside className="pdf-thumb-rail" aria-label="Pages">
            <p className="pdf-thumb-rail-label">Pages</p>
            <div className="pdf-thumb-list">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isActive = currentPage === page;

                return (
                  <button
                    type="button"
                    key={`thumb-${page}`}
                    ref={(element) => {
                      thumbButtonRefs.current[index] = element;
                    }}
                    className={`pdf-thumb${isActive ? " is-active" : ""}`}
                    onClick={() => goToPage(page)}
                    aria-label={`Go to page ${page} of ${totalPages}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="pdf-thumb-frame">
                      <canvas
                        ref={(element) => {
                          thumbCanvasRefs.current[index] = element;
                        }}
                      />
                    </span>
                    <span className="pdf-thumb-number" aria-hidden="true">
                      {String(page).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        ) : null}

        <div
          className={`pdf-viewer-content${showPreparing ? " is-preparing" : ""}`}
          ref={contentRef}
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
                <button
                  type="button"
                  className="pdf-state-secondary"
                  onClick={onClose}
                >
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
              <div
                className="pdf-pages"
                ref={pagesRef}
                style={{ "--pdf-zoom": String(zoom) }}
              >
                {Array.from({ length: totalPages }, (_, index) => (
                  <div
                    key={`page-${index + 1}`}
                    ref={(element) => {
                      pageWrapperRefs.current[index] = element;
                    }}
                    className="pdf-page-wrapper"
                    role="group"
                    aria-label={`Page ${index + 1} of ${totalPages}`}
                    aria-current={
                      currentPage === index + 1 ? "page" : undefined
                    }
                  >
                    <canvas
                      ref={(element) => {
                        canvasRefs.current[index] = element;
                      }}
                      className="pdf-page-canvas"
                    />
                    <span className="pdf-page-number" aria-hidden="true">
                      {pageLabel(index + 1, totalPages)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showDocument ? (
        <div className="pdf-mobile-dock">
          {totalPages > 1 ? (
            <>
              <div className="pdf-mobile-group" aria-label="Page navigation">
                <button
                  type="button"
                  className="pdf-icon-button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <p className="pdf-mobile-page" aria-live="polite">
                  {pageLabel(currentPage, totalPages)}
                </p>
                <button
                  type="button"
                  className="pdf-icon-button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  aria-label="Next page"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <span className="pdf-mobile-divider" aria-hidden="true" />
            </>
          ) : null}

          <div className="pdf-mobile-group" aria-label="Zoom">
            <button
              type="button"
              className="pdf-icon-button"
              onClick={zoomOut}
              disabled={!canZoomOut}
              aria-label="Zoom out"
            >
              <span aria-hidden="true">−</span>
            </button>
            <button
              type="button"
              className="pdf-mobile-zoom-value"
              onClick={resetZoom}
              aria-label={`Zoom ${Math.round(zoom * 100)} percent. Reset to fit width.`}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="pdf-icon-button"
              onClick={zoomIn}
              disabled={!canZoomIn}
              aria-label="Zoom in"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
