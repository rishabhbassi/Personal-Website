import React, { useEffect, useState } from "react";
import useDialogFocus from "../hooks/useDialogFocus";
import indiaFmImage from "../assets/side-quests/india-fm.webp";
import fondImage from "../assets/side-quests/fond.webp";
import finOsImage from "../assets/side-quests/fin-os.webp";
import "./SideQuests.css";

const SIDE_QUESTS = [
  {
    id: "india-fm",
    index: "01",
    field: "Music & culture",
    title: "India FM",
    tagline: "Apni duniya, apna volume.",
    description:
      "A desi radio app built around moods and moments — highway anthems, chai-tapri easy listening, and baraat bangers. Ten stations, zero awkward silences.",
    descriptionLong:
      "India FM is a love letter to the sounds and scenes of everyday India. Instead of an endless algorithmic feed, it starts with a feeling — the 2 AM highway drive, the chai break, the baraat — and tunes into a station built for that moment.",
    inside: [
      "Ten mood-led stations, from Truck Wala to PG Room.",
      "A live player with a queue and a browse-by-mood station shelf.",
      "A retro desi visual world of records, highway signs, and sticker type.",
    ],
    tags: ["Music", "Interaction", "Web app"],
    image: indiaFmImage,
    imageAlt:
      "India FM homepage with a spinning record and the row of desi radio stations",
    url: "https://india-fm.vercel.app/",
  },
  {
    id: "fond",
    index: "02",
    field: "AI & social",
    title: "Fond",
    tagline: "Your relationship has a score.",
    description:
      "Post a story about your partner, let an AI judge it out of 100, and watch it climb a global relationship leaderboard. Romance meets reality TV.",
    descriptionLong:
      "Fond turns the small stories couples tell each other into a public, playable format. Write the story, an AI delivers a verdict out of 100, and the card can be shared and ranked against couples in your city and around the world.",
    inside: [
      "A three-step loop: write the story, get scored, share the card.",
      "Verdict cards with a score, a one-line roast, and a leaderboard rank.",
      "City and global rankings built around the receipts.",
    ],
    tags: ["AI", "Product design", "Social"],
    image: fondImage,
    imageAlt:
      "Fond leaderboard ranking couples out of 100 above the line “Your partner deserves a score.”",
    url: "https://onlyfond.vercel.app/",
  },
  {
    id: "fin-os",
    index: "03",
    field: "Fintech & data",
    title: "FinOS",
    tagline: "A personal finance operating system.",
    description:
      "A workspace that pulls planning, transactions, budgets, investments, goals, and reports into one dashboard — the whole financial picture, finally in one view.",
    descriptionLong:
      "FinOS is a personal finance workspace rather than another budgeting spreadsheet. Planning, transactions, budgets, investments, goals, and reports share one navigation, with a dashboard that tries to show the whole picture at a glance.",
    inside: [
      "A dashboard spanning transactions, budgets, investments, goals, and reports.",
      "A planner for mapping what is coming next.",
      "One navigation model that keeps every money module a click away.",
    ],
    tags: ["Fintech", "Dashboard", "Data"],
    image: finOsImage,
    imageAlt:
      "FinOS monthly planner with income sources, fixed expenses, and a savings summary",
    url: "https://finos-dev.vercel.app/auth/login",
  },
];

function SideQuestCard({ quest, onOpen }) {
  const titleId = `side-quest-${quest.id}-title`;
  const taglineId = `side-quest-${quest.id}-tagline`;

  return (
    <button
      type="button"
      className="sq-card"
      onClick={() => onOpen(quest)}
      aria-haspopup="dialog"
      aria-labelledby={titleId}
      aria-describedby={taglineId}
    >
      <span className="sq-card-visual">
        <img
          src={quest.image}
          alt={quest.imageAlt}
          width="900"
          height="625"
          loading="lazy"
          decoding="async"
        />
        <span className="sq-card-index" aria-hidden="true">
          {quest.index}
        </span>
        <span className="sq-card-open" aria-hidden="true">
          ↗
        </span>
      </span>

      <span className="sq-card-body">
        <span className="sq-card-field">{quest.field}</span>
        <span className="sq-card-title" id={titleId} role="heading" aria-level="3">
          {quest.title}
        </span>
        <span className="sq-card-tagline" id={taglineId}>
          {quest.tagline}
        </span>
        <span className="sq-card-description">{quest.description}</span>

        <span className="sq-card-foot">
          <span className="sq-card-tags" aria-label="Topics">
            {quest.tags.map((tag) => (
              <span className="sq-card-tag" key={tag}>
                {tag}
              </span>
            ))}
          </span>
          <span className="sq-card-cta">
            View project
            <span aria-hidden="true">→</span>
          </span>
        </span>
      </span>
    </button>
  );
}

function SideQuestDialog({ quest, onClose }) {
  const dialogRef = useDialogFocus(onClose);
  const titleId = `side-quest-dialog-${quest.id}-title`;
  const descriptionId = `side-quest-dialog-${quest.id}-description`;

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="sq-modal-overlay" onMouseDown={handleOverlayMouseDown}>
      <div
        ref={dialogRef}
        className="sq-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <button
          type="button"
          className="sq-modal-close"
          onClick={onClose}
          aria-label="Close project details"
          data-autofocus
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>

        <div className="sq-modal-media">
          <img
            className="sq-modal-media-bg"
            src={quest.image}
            alt=""
            aria-hidden="true"
            width="900"
            height="625"
            decoding="async"
          />
          <img
            className="sq-modal-media-img"
            src={quest.image}
            alt={quest.imageAlt}
            width="900"
            height="625"
            decoding="async"
          />
          <span className="sq-modal-media-label">
            {quest.index} / {quest.field}
          </span>
        </div>

        <div className="sq-modal-body">
          <p className="sq-modal-eyebrow">Side quest {quest.index} / Live</p>
          <h2 className="sq-modal-title" id={titleId}>
            {quest.title}
          </h2>
          <p className="sq-modal-tagline">{quest.tagline}</p>
          <p className="sq-modal-description" id={descriptionId}>
            {quest.descriptionLong}
          </p>

          <div className="sq-modal-inside">
            <p className="sq-modal-label">What&apos;s inside</p>
            <ul>
              {quest.inside.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="sq-modal-tags" aria-label="Topics">
            {quest.tags.map((tag) => (
              <span className="sq-modal-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="sq-modal-actions">
            <a
              className="sq-modal-visit"
              href={quest.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {quest.title}
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="sq-modal-url">{new URL(quest.url).hostname}</p>
            <button
              type="button"
              className="sq-modal-close-text"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SideQuests() {
  const [activeQuest, setActiveQuest] = useState(null);

  useEffect(() => {
    if (!activeQuest) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeQuest]);

  const closeDialog = () => setActiveQuest(null);

  return (
    <>
      <section
        id="side-quests"
        className="sq-section"
        aria-labelledby="side-quests-title"
      >
        <div className="sq-header">
          <div>
            <p className="sq-eyebrow">
              <span className="homepage-eyebrow-index">03</span>
              After hours / Built for the fun of it
            </p>
            <h2 className="sq-heading" id="side-quests-title">
              Side Quests
            </h2>
          </div>
          <p className="sq-note">
            Small ideas that escaped the notebook. No client brief, no roadmap —
            just a weekend and the urge to see them live. Open one to take a
            closer look.
          </p>
        </div>

        <div className="sq-grid">
          {SIDE_QUESTS.map((quest) => (
            <SideQuestCard
              key={quest.id}
              quest={quest}
              onOpen={setActiveQuest}
            />
          ))}
        </div>
      </section>

      {activeQuest && (
        <SideQuestDialog quest={activeQuest} onClose={closeDialog} />
      )}
    </>
  );
}
