import React from "react";
import useDialogFocus from "../hooks/useDialogFocus";
import "./ContactPopup.css";

const EMAIL = "rishabhb.career@gmail.com";
const PHONE = "+91 8529177707";
const LINKEDIN = "https://www.linkedin.com/in/rishabh-bassi-5981a9223/";
const GITHUB = "https://github.com/rishabhbassi";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73a1.76 1.76 0 1 1 0-3.52 1.76 1.76 0 0 1 0 3.52zM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.77c1.4-2.59 7-2.78 7 2.47V19z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.43-2.68 5.4-5.24 5.69.41.35.77 1.04.77 2.1v3.11c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export default function ContactPopup({ onClose }) {
  const dialogRef = useDialogFocus(onClose);

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="contact-overlay" onMouseDown={handleOverlayMouseDown}>
      <div
        ref={dialogRef}
        className="contact-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        aria-describedby="contact-description"
        tabIndex={-1}
      >
        <div className="contact-dialog-rail">
          <p className="contact-kicker">Contact / Let&apos;s talk</p>
          <button
            type="button"
            className="contact-close"
            onClick={onClose}
            aria-label="Close contact dialog"
            data-autofocus
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <div className="contact-dialog-body">
          <h2 className="contact-title" id="contact-title">
            Get in
            <br />
            <span>touch.</span>
          </h2>

          <p className="contact-description" id="contact-description">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision. Feel free to reach out —
            let&apos;s create something thoughtful together.
          </p>

          <div className="contact-channels">
            <a className="contact-channel" href={`mailto:${EMAIL}`}>
              <span className="contact-channel-icon"><MailIcon /></span>
              <span className="contact-channel-copy">
                <span className="contact-channel-label">Email</span>
                <span className="contact-channel-value">{EMAIL}</span>
              </span>
              <span className="contact-channel-arrow" aria-hidden="true">↗</span>
            </a>

            <a className="contact-channel" href="tel:+918529177707">
              <span className="contact-channel-icon"><PhoneIcon /></span>
              <span className="contact-channel-copy">
                <span className="contact-channel-label">Phone</span>
                <span className="contact-channel-value">{PHONE}</span>
              </span>
              <span className="contact-channel-arrow" aria-hidden="true">↗</span>
            </a>

            <a
              className="contact-channel"
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-channel-icon"><LinkedInIcon /></span>
              <span className="contact-channel-copy">
                <span className="contact-channel-label">LinkedIn</span>
                <span className="contact-channel-value">Rishabh Bassi</span>
              </span>
              <span className="contact-channel-arrow" aria-hidden="true">↗</span>
            </a>

            <a
              className="contact-channel"
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-channel-icon"><GitHubIcon /></span>
              <span className="contact-channel-copy">
                <span className="contact-channel-label">GitHub</span>
                <span className="contact-channel-value">rishabhbassi</span>
              </span>
              <span className="contact-channel-arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="contact-dialog-footer">
            <p><kbd>Esc</kbd> to close</p>
            <button type="button" className="contact-dialog-close-text" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
