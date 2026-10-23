import React from "react";
import useDialogFocus from "../hooks/useDialogFocus";
import "./ContactPopup.css";

const EMAIL = "rishabhb.career@gmail.com";
const PHONE = "+91 8529177707";
const LINKEDIN = "https://www.linkedin.com/in/rishabh-bassi-5981a9223/";

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
