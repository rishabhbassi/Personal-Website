import React, { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import portfolioPDF from "../assets/Portfolio.pdf";
import portfolioBookPDF from "../assets/Portfolio Book.pdf";
import "./PDFViewer.css";

// Set up PDF.js worker - use local worker file from public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PDFViewer({ isOpen, onClose, pdfUrl, title = "Design", downloadFileName }) {
  const [totalPages, setTotalPages] = useState(0);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [renderedPages, setRenderedPages] = useState([]);
  const canvasRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDownloadOptions && !event.target.closest('.pdf-download-wrapper')) {
        setShowDownloadOptions(false);
      }
    };

    if (showDownloadOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDownloadOptions]);


  // Load PDF document
  useEffect(() => {
    if (!isOpen) return;

    const loadPDF = async () => {
      setIsLoading(true);
      try {
        // Use provided pdfUrl or fallback to portfolioPDF
        const pdfToLoad = pdfUrl || portfolioPDF;
        console.log('Loading PDF...', { pdfToLoad });
        // Vite imports PDFs as URLs, use them directly
        const pdf = await pdfjsLib.getDocument({
          url: pdfToLoad,
          withCredentials: false
        }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        // Initialize canvas refs for all pages
        canvasRefs.current = Array(pdf.numPages).fill(null).map(() => ({ current: null }));
        setRenderedPages(Array(pdf.numPages).fill(false));
        console.log('Loaded PDF, total pages:', pdf.numPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [isOpen, pdfUrl]);

  // Render page function
  const renderPage = async (pdfDocument, pageNum, canvasRef) => {
    if (!pdfDocument || !canvasRef.current || pageNum < 1) return;

    try {
      const page = await pdfDocument.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Get container dimensions - use full viewport width
      const containerWidth = window.innerWidth;
      
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Calculate scale to fill the width (allow vertical scrolling)
      const scale = containerWidth / viewport.width;
      
      const scaledViewport = page.getViewport({ scale });
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };

      await page.render(renderContext).promise;
      console.log(`Rendered page ${pageNum} on canvas, scale: ${scale.toFixed(2)}`);
      
      // Mark page as rendered
      setRenderedPages(prev => {
        const newRendered = [...prev];
        newRendered[pageNum - 1] = true;
        return newRendered;
      });
    } catch (error) {
      console.error(`Error rendering page ${pageNum}:`, error);
    }
  };

  // Render all pages when PDF loads and canvases are ready
  useEffect(() => {
    if (!isOpen || !pdfDoc || totalPages === 0) return;

    const renderAllPages = async () => {
      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const renderPromises = [];
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const canvasRef = canvasRefs.current[pageNum - 1];
        if (canvasRef && canvasRef.current) {
          // Render page
          renderPromises.push(renderPage(pdfDoc, pageNum, canvasRef));
        }
      }
      
      // Wait for all pages to render
      await Promise.all(renderPromises);
    };

    renderAllPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, isOpen, totalPages]);

  // Re-render on window resize
  useEffect(() => {
    if (!isOpen || !pdfDoc) return;

    const handleResize = () => {
      // Re-render all pages on resize
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const canvasRef = canvasRefs.current[pageNum - 1];
        if (canvasRef && canvasRef.current) {
          renderPage(pdfDoc, pageNum, canvasRef);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, isOpen, totalPages]);


  if (!isOpen) return null;

  const handleDownloadFullPage = () => {
    const link = document.createElement("a");
    const pdfToDownload = pdfUrl || portfolioPDF;
    link.href = pdfToDownload;
    link.download = downloadFileName || "Document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadOptions(false);
  };

  const handleDownloadBookFormat = () => {
    // Only show book format for portfolio, otherwise just download the PDF
    const link = document.createElement("a");
    const pdfToDownload = pdfUrl || portfolioBookPDF;
    link.href = pdfToDownload;
    link.download = downloadFileName ? downloadFileName.replace('.pdf', ' Book.pdf') : "Document Book.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadOptions(false);
  };


  return (
    <div className="pdf-viewer-page">
      <div className="pdf-viewer-header">
        <button className="pdf-back-button" onClick={onClose}>
          ← Back
        </button>
        <div className="pdf-viewer-title">{title}</div>
        <div className="pdf-viewer-controls">
          <div className="pdf-download-wrapper" style={{ position: "relative" }}>
            <button
              className="pdf-download-button"
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
            >
              Download
            </button>
            {showDownloadOptions && (
              <div className="download-options">
                <button
                  className="download-option-button"
                  onClick={handleDownloadFullPage}
                >
                  Download PDF
                </button>
                {!pdfUrl && (
                  <button
                    className="download-option-button"
                    onClick={handleDownloadBookFormat}
                  >
                    Download Book Format
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pdf-viewer-content">
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#fff' }}>
            Loading PDF...
          </div>
        ) : (
          <div className="all-pages-container">
            {Array.from({ length: totalPages }, (_, index) => {
              // Ensure ref exists
              if (!canvasRefs.current[index]) {
                canvasRefs.current[index] = { current: null };
              }
              return (
                <div key={`page-${index}`} className="pdf-page-wrapper">
                  <canvas
                    ref={(el) => {
                      if (canvasRefs.current[index]) {
                        canvasRefs.current[index].current = el;
                      }
                    }}
                    className="pdf-page-canvas"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

