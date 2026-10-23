import React, { useCallback, useEffect, useRef, useState } from "react";
import researchPapers from "../data/researchPapers";
import useDialogFocus from "../hooks/useDialogFocus";
import "./ResearchSection.css";

function PaperFacts({ paper }) {
  return (
    <dl className="research-brief-facts">
      <div>
        <dt>Published</dt>
        <dd>{paper.date}</dd>
      </div>
      <div>
        <dt>Type</dt>
        <dd>{paper.type}</dd>
      </div>
      <div>
        <dt>Length</dt>
        <dd>{paper.pages} pages</dd>
      </div>
      <div>
        <dt>Field</dt>
        <dd>{paper.field}</dd>
      </div>
    </dl>
  );
}

function BriefSection({ section }) {
  const headingId = `brief-${section.id}-title`;

  return (
    <section
      className="research-brief-section"
      id={`brief-${section.id}`}
      aria-labelledby={headingId}
    >
      <p className="research-brief-section-kicker">
        <span aria-hidden="true">{section.number}</span>
        {section.kicker}
      </p>
      <h2 id={headingId}>{section.title}</h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 42)}>{paragraph}</p>
      ))}

      {section.points ? (
        <dl className="research-brief-points">
          {section.points.map((point) => (
            <div key={point.label}>
              <dt>{point.label}</dt>
              <dd>{point.text}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {section.callout ? (
        <aside className="research-brief-callout">
          <p>{section.callout.label}</p>
          <p>{section.callout.text}</p>
        </aside>
      ) : null}

      {section.metrics ? (
        <figure className="research-metrics">
          <figcaption>{section.metrics.caption}</figcaption>
          <div className="research-metrics-scroll">
            <table>
              <thead>
                <tr>
                  {section.metrics.columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.metrics.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, cellIndex) =>
                      cellIndex === 0 ? (
                        <th key={cell} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={`${row[0]}-${cellIndex}`}>{cell}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      ) : null}

      {section.note ? (
        <aside className="research-brief-note">
          <p>{section.note.label}</p>
          <p>{section.note.text}</p>
        </aside>
      ) : null}
    </section>
  );
}

function ResearchBrief({ paper, onBack, headingRef }) {
  return (
    <div className="research-container research-brief-container">
      <article className="research-brief">
        <header className="research-brief-header">
          <p className="research-eyebrow">
            Research brief {paper.index} / {paper.field}
          </p>
          <h1
            className="research-brief-title"
            id="research-title"
            tabIndex={-1}
            ref={headingRef}
          >
            {paper.title}
          </h1>
          <p className="research-brief-authors">{paper.authorLine}</p>
          <p className="research-brief-lede">{paper.lede}</p>
          <PaperFacts paper={paper} />
        </header>

        <div className="research-brief-layout">
          <aside className="research-brief-sidebar" aria-label="Brief overview">
            <div className="research-brief-contents">
              <p>In this brief</p>
              <nav aria-label="Brief sections">
                {paper.sections.map((section) => (
                  <a href={`#brief-${section.id}`} key={section.id}>
                    <span aria-hidden="true">{section.number}</span>
                    {section.kicker}
                  </a>
                ))}
              </nav>
            </div>

            <div className="research-brief-glance">
              <p>At a glance</p>
              <p>{paper.takeaway}</p>
            </div>

            <a
              className="research-brief-sidebar-download"
              href={paper.pdfUrl}
              download={paper.downloadName}
            >
              Full paper PDF
              <span>{paper.pdfSize} ↓</span>
            </a>
          </aside>

          <div className="research-brief-body">
            {paper.sections.map((section) => (
              <BriefSection section={section} key={section.id} />
            ))}

            <section
              className="research-brief-section research-brief-next"
              aria-labelledby="brief-next-title"
            >
              <p className="research-brief-section-kicker">
                <span aria-hidden="true">05</span>
                Next
              </p>
              <h2 id="brief-next-title">What would come next</h2>
              <p>{paper.futureWork}</p>
            </section>

            <div className="research-brief-download">
              <div>
                <p>Archival version</p>
                <h2>Read the full paper</h2>
                <p>
                  The original typeset document is available as a PDF for
                  citation and deeper reading.
                </p>
              </div>
              <a
                href={paper.pdfUrl}
                download={paper.downloadName}
              >
                Download PDF
                <span>{paper.pdfSize} ↓</span>
              </a>
            </div>

            <footer className="research-brief-footer">
              <button type="button" onClick={onBack}>
                <span aria-hidden="true">←</span> All research
              </button>
              <p>
                {paper.authorLine} / {paper.year}
              </p>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function ResearchSection({ onClose }) {
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const selectedPaper =
    researchPapers.find((paper) => paper.id === selectedPaperId) ?? null;

  const pageRef = useRef(null);
  const briefHeadingRef = useRef(null);
  const lastPaperIdRef = useRef(null);

  const requestClose = useCallback(() => {
    if (selectedPaperId) {
      setSelectedPaperId(null);
      return;
    }
    onClose();
  }, [selectedPaperId, onClose]);

  const dialogRef = useDialogFocus(requestClose);

  const setRootRef = useCallback(
    (node) => {
      pageRef.current = node;
      dialogRef.current = node;
    },
    [dialogRef],
  );

  useEffect(() => {
    if (selectedPaperId) {
      if (pageRef.current) pageRef.current.scrollTop = 0;
      const frame = window.requestAnimationFrame(() => {
        briefHeadingRef.current?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const paperId = lastPaperIdRef.current;
    if (!paperId) return undefined;
    lastPaperIdRef.current = null;

    const frame = window.requestAnimationFrame(() => {
      const trigger = pageRef.current?.querySelector(
        `[data-paper-open="${paperId}"]`,
      );
      if (!trigger) return;
      trigger.focus({ preventScroll: true });
      trigger.scrollIntoView({ block: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedPaperId]);

  const openBrief = (paper) => {
    lastPaperIdRef.current = paper.id;
    setSelectedPaperId(paper.id);
  };

  return (
    <div
      className="research-page"
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-title"
      ref={setRootRef}
      tabIndex={-1}
    >
      <header className="research-topbar">
        <div className="research-topbar-inner">
          <button
            type="button"
            className="research-back-button"
            onClick={requestClose}
            data-autofocus
          >
            <span aria-hidden="true">←</span>{" "}
            {selectedPaper ? "All research" : "Back"}
          </button>
          <p className="research-topbar-label">
            {selectedPaper
              ? "Research / Brief"
              : "Research / Selected briefs"}
          </p>
          <p className="research-topbar-count">
            {selectedPaper
              ? selectedPaper.type
              : "02 briefs · 2024"}
          </p>
        </div>
      </header>

      {selectedPaper ? (
        <ResearchBrief
          paper={selectedPaper}
          onBack={requestClose}
          headingRef={briefHeadingRef}
        />
      ) : (
        <div className="research-container">
          <header className="research-hero">
            <div>
              <p className="research-eyebrow">Selected work / Research</p>
              <h1 className="research-heading" id="research-title">
                Research
                <br />
                <span>in brief.</span>
              </h1>
            </div>
            <p className="research-intro">
              Two 2024 papers on applied AI and infrastructure planning,
              translated into web briefs. Get the argument, method, and caveats
              in a few minutes. Full PDFs remain available for the archival
              version.
            </p>
          </header>

          <div className="research-cards-grid">
            {researchPapers.map((paper) => (
              <article className="research-card" key={paper.id}>
                <div className="research-card-rail">
                  <span>Brief {paper.index}</span>
                  <span>
                    {paper.year} · {paper.pages} pp
                  </span>
                </div>

                <div className="research-card-content">
                  <p className="research-card-field">{paper.field}</p>
                  <h2 className="research-card-title">{paper.title}</h2>
                  <p className="research-card-meta">
                    <span>{paper.authorLine}</span>
                    <span className="research-card-date">{paper.date}</span>
                  </p>
                  <p className="research-card-description">{paper.summary}</p>
                  <ul className="research-card-tags" aria-label="Topics">
                    {paper.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>

                <div className="research-card-actions">
                  <button
                    type="button"
                    className="research-card-action"
                    data-paper-open={paper.id}
                    onClick={() => openBrief(paper)}
                    aria-label={`Read the research brief for ${paper.title}`}
                  >
                    Read brief
                    <span aria-hidden="true">↗</span>
                  </button>
                  <a
                    className="research-card-pdf"
                    href={paper.pdfUrl}
                    download={paper.downloadName}
                    aria-label={`Download the full PDF of ${paper.title} (${paper.pdfSize})`}
                  >
                    PDF <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <footer className="research-footer">
            <p>Research archive / 2024</p>
            <button type="button" onClick={onClose}>
              Back to portfolio <span aria-hidden="true">↑</span>
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
