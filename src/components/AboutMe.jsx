import React, { useCallback, useEffect, useRef, useState } from "react";
import rishabhImage from "../assets/Rishabh_image.jpeg";
import resume from "../assets/Rishabh_Bassi_Resume.pdf";
import useDialogFocus from "../hooks/useDialogFocus";
import "./AboutMe.css";

const aboutData = {
  name: "Rishabh Bassi",
  title: "Data, AI & Product Engineer",
  email: "rishabhb.career@gmail.com",
  phone: "+91 8529177707",
  location: "New Delhi, India",
  linkedin: "https://www.linkedin.com/in/rishabh-bassi-5981a9223/",
  github: "https://github.com/rishabhbassi",
  education: [
    {
      degree: "Bachelor of Technology",
      institution: "Manipal University Jaipur",
      period: "Aug 2021 - Jul 2025",
      details:
        "Major: Computer Science and Engineering · Minor: Data Analytics · CGPA: 8.18/10.0",
    },
    {
      degree: "CBSE XII",
      institution: "Jankidas Kapur Public School",
      period: "Apr 2020 - Mar 2021",
      details: "Percentage: 85.6%",
    },
    {
      degree: "CBSE X",
      institution: "Jankidas Kapur Public School",
      period: "Apr 2018 - Mar 2019",
      details: "Percentage: 88.2%",
    },
  ],
  workExperience: [
    {
      role: "Full Stack AI Engineer",
      company: "Tata Consultancy Services",
      period: "Feb 2026 - Present",
      description:
        "Building data and AI solutions for healthcare and life-sciences clients — backend services, REST APIs, ETL/ELT pipelines, and rapid POCs spanning document intelligence, retrieval, and AI workflows. Working across requirements, solution design, development, testing, and deployment with Python, FastAPI, SQL, and Azure.",
    },
    {
      role: "Founding Product and AI Engineer",
      company: "Vibelets.ai",
      period: "Feb 2025 - Feb 2026",
      description:
        "Architected a 6–7 agent marketing-intelligence platform with Python, FastAPI, Google ADK, A2A, and LLMs, automating research, content generation, monitoring, and optimization. Built the backend and data layer on PostgreSQL, MongoDB, InfluxDB, Redis, AWS EC2, and S3, integrated 10+ external platforms, and supported 15–20 beta users across 2–3 teams.",
    },
    {
      role: "Research and Analysis Intern",
      company: "DRDO Scientific Analysis Group (SAG)",
      period: "Mar 2025 - May 2025",
      description:
        "Conducted classified cryptanalysis research to distinguish manipulated Grain cipher outputs from random bitstreams. Benchmarked analytical techniques on 100k+ samples and delivered structured performance reports under strict confidentiality.",
    },
    {
      role: "Analyst Trainee",
      company: "PwC Digital Analytics Launchpad",
      period: "Feb 2024 - Jul 2024",
      description:
        "Selected for PwC's competitive analytics program with hands-on work in SQL, RDBMS, and AI/ML. Solved case-based business problems and produced data-driven recommendations as part of certification projects.",
    },
    {
      role: "Growth and Strategy Intern",
      company: "Kuber Pipes",
      period: "Dec 2023 - Jan 2024",
      description:
        "Identified churn and profitability issues in the HCT product line through product and market analysis. Recommended design and process improvements using global benchmarks, strengthening overall product performance.",
    },
  ],
  projects: [
    {
      title: "EV Infrastructure Planning with Geospatial ML",
      description:
        "Designed a location intelligence tool identifying high-demand EV charging zones, improving urban accessibility by 46%. Patent: 202411054249 A; Research paper submitted to Multimedia Tools and Applications.",
    },
    {
      title: "Healthcare Decision Intelligence Platform",
      description:
        "Built an AI-enabled healthcare platform combining data processing, document intelligence, semantic retrieval, and analytics to automate medical-record analysis. Turns unstructured clinical information into contextual, decision-ready insights using LLMs, RAG, and a vector database.",
    },
    {
      title: "Credit Risk Analytics & ETL Pipeline",
      description:
        "Developed an end-to-end credit-risk pipeline on Databricks using Medallion Architecture across Bronze, Silver, and Gold layers. Built Python ETL workflows for ingestion, transformation, cleansing, and validation, with Power BI dashboards tracking portfolio risk and exposure.",
    },
    {
      title: "Customer Churn Analytics & Retention Dashboard",
      description:
        "Built an end-to-end customer churn project in Databricks and Power BI — ingesting, cleaning, and modeling customer data, then surfacing churn drivers, at-risk segments, and retention opportunities in a stakeholder dashboard.",
    },
    {
      title: "Multi-Agent Financial Intelligence Platform",
      description:
        "Built an AI-powered pipeline for extracting insights and validating invoices with task-specific agents. Reduced reporting turnaround by 25% through automation of routine finance operations.",
    },
    {
      title: "Consumer Behavior Analysis for Streaming Growth",
      description:
        "Analyzed 10 years of user data to identify key drivers behind Netflix's 300% market growth. Assessed the recommendation engine's impact, linking it to a 75% increase in user engagement through personalized content.",
    },
  ],
  leadership: [
    {
      role: "Advisor",
      organization: "IEEE SB MUJ",
      period: "May 2024 - May 2025",
      description:
        "Continued with the branch after serving as General Secretary, supporting the incoming team and its initiatives.",
    },
    {
      role: "Convenor",
      organization: "Oneiros, Manipal University Jaipur",
      period: "2024 - 2025",
      description:
        "Led the student team behind Oneiros, the university's annual cultural festival, coordinating across creative, production, and operations groups.",
    },
    {
      role: "General Secretary",
      organization: "IEEE SB MUJ",
      period: "May 2023 - May 2024",
      description:
        "Led a community of 1,000+ members and a team of 300+ students, organizing 25+ events. Spearheaded strategic initiatives that boosted member engagement by 35%.",
    },
    {
      role: "Convenor",
      organization: "Techstars Google for Startups Startup Weekend Jaipur",
      period: "Mar 2023 - Oct 2023",
      description:
        "Orchestrated planning and execution of a city-level startup event with 100+ student volunteers. Managed logistics and secured mentorship from 30+ industry leaders.",
    },
    {
      role: "Creative Director",
      organization: "TEDx ManipalUniversityJaipur",
      period: "May 2023 - Oct 2023",
      description:
        "Directed a team of 50+ students in speaker selection, event promotion, and creative vision. Increased audience turnout through targeted theme design and cross-platform marketing.",
    },
  ],
  skills: [
    {
      title: "Programming & Data",
      items: [
        "Python",
        "SQL",
        "Pandas",
        "Data Processing",
        "Data Analysis",
        "Excel",
      ],
    },
    {
      title: "Data Engineering",
      items: [
        "ETL/ELT",
        "Data Pipelines",
        "Data Transformation",
        "Data Quality",
        "Data Modeling",
        "REST APIs",
      ],
    },
    {
      title: "Databases & Cloud",
      items: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "InfluxDB",
        "AWS (EC2, S3)",
        "Azure",
        "Azure OpenAI",
        "Azure Functions",
        "Azure Blob Storage",
        "Git/GitHub",
      ],
    },
    {
      title: "AI & Analytics",
      items: [
        "Generative AI",
        "LLMs",
        "RAG",
        "Multi-Agent Systems",
        "Machine Learning",
        "Vector Search",
        "Power BI",
        "Tableau",
      ],
    },
    {
      title: "Design",
      items: ["UI/UX Design", "Graphic Design", "Creative Problem Solving"],
    },
    {
      title: "Professional",
      items: [
        "Problem Solving",
        "Analytical Thinking",
        "Communication",
        "Stakeholder Management",
      ],
    },
  ],
  awards: [
    "Star Team Award, Tata Consultancy Services",
    "Performance Excellence Award, Adsparkx Media",
    "Winner, Designathon, School of Computer Science and Engineering, MUJ",
    "2x Student Excellence Award, School of Computer Science and Engineering, MUJ",
    "Silver Certificate, Technothlon, IIT Guwahati",
    "JK Pal Memorial Award, IEEE Delhi Section",
  ],
  certifications: [
    "Claude Certified Associate – Foundations",
    "Build with Gemini — Google Cloud",
    "Meta Front-end Development",
    "Google Data Analytics",
    "IBM SQL for Data Science with Python",
    "Multi AI Agent Systems with crewAI",
    "HackerRank SQL Gold Badge",
    "HackerRank SQL Intermediate Certificate",
  ],
  resumeUrl: resume,
};

const ABOUT_SECTIONS = [
  { id: "profile", label: "Profile", kicker: "About", number: "01" },
  {
    id: "experience",
    label: "Experience",
    kicker: "Work history",
    number: "02",
  },
  {
    id: "projects",
    label: "Projects",
    kicker: "Selected builds",
    number: "03",
  },
  {
    id: "leadership",
    label: "Leadership",
    kicker: "Community",
    number: "04",
  },
  { id: "skills", label: "Skills", kicker: "Toolkit", number: "05" },
  {
    id: "education",
    label: "Education",
    kicker: "Training",
    number: "06",
  },
  {
    id: "recognition",
    label: "Recognition",
    kicker: "Awards & certificates",
    number: "07",
  },
  { id: "contact", label: "Contact", kicker: "Contact", number: "08" },
];

const PROFILE_FACTS = [
  {
    value: "05",
    label: "Roles",
    note: "Data, AI, product, research, and analytics",
  },
  {
    value: "05",
    label: "Leadership roles",
    note: "IEEE, Oneiros, Startup Weekend, and TEDx",
  },
  {
    value: "01",
    label: "Patent application",
    note: "202411054249 A",
  },
  {
    value: "8.18",
    label: "CGPA / 10",
    note: "B.Tech CSE, Data Analytics minor",
  },
];

const formatPeriod = (period) => period.replace(" - ", " — ");

function SectionHeading({ section, title, note }) {
  return (
    <header className="about-section-head">
      <p className="about-section-kicker">
        <span aria-hidden="true">{section.number}</span>
        {section.kicker}
      </p>
      <h2 id={`about-${section.id}-title`}>{title}</h2>
      {note ? <p className="about-section-note">{note}</p> : null}
    </header>
  );
}

function ExperienceItem({ entry, index }) {
  const current = entry.period.includes("Present");

  return (
    <li className="about-experience-item">
      <div className="about-experience-timeline">
        <p className="about-experience-period">
          {formatPeriod(entry.period)}
        </p>
        {current ? (
          <p className="about-current">
            <span aria-hidden="true" />
            Current
          </p>
        ) : null}
      </div>
      <div className="about-experience-main">
        <p className="about-experience-index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3>{entry.role}</h3>
        <p className="about-experience-company">{entry.company}</p>
        <p className="about-experience-copy">{entry.description}</p>
      </div>
    </li>
  );
}

function ProjectCard({ project, index }) {
  return (
    <article className="about-project">
      <p className="about-project-index" aria-hidden="true">
        Project {String(index + 1).padStart(2, "0")}
      </p>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </article>
  );
}

function LeadershipItem({ entry, index }) {
  return (
    <article className="about-leadership-item">
      <p className="about-leadership-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </p>
      <p className="about-leadership-org">{entry.organization}</p>
      <h3>{entry.role}</h3>
      <p className="about-leadership-period">
        {formatPeriod(entry.period)}
      </p>
      <p className="about-leadership-copy">{entry.description}</p>
    </article>
  );
}

function RecognitionList({ title, items }) {
  return (
    <div className="about-recognition-block">
      <h3>
        {title}
        <span>
          {String(items.length).padStart(2, "0")}
        </span>
      </h3>
      <ul>
        {items.map((item, index) => (
          <li key={item}>
            <span aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutMe({ onClose, onViewResume }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [showToTop, setShowToTop] = useState(false);
  const pageRef = useRef(null);
  const mobileIndexRef = useRef(null);

  const dialogRef = useDialogFocus(onClose);

  const setRootRef = useCallback(
    (node) => {
      pageRef.current = node;
      dialogRef.current = node;
    },
    [dialogRef],
  );

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const sections = ABOUT_SECTIONS.map((section) =>
      page.querySelector(`#about-${section.id}`),
    ).filter(Boolean);

    let frame = 0;

    const update = () => {
      frame = 0;
      if (!sections.length) return;

      // On mobile the sticky contents bar sits under the topbar, so a section
      // only counts as current once it has cleared both.
      const threshold =
        page.getBoundingClientRect().top +
        (window.innerWidth <= 900 ? 176 : 130);
      const atBottom =
        page.scrollTop + page.clientHeight >= page.scrollHeight - 8;
      let current = sections[0];

      if (atBottom) {
        current = sections[sections.length - 1];
      } else {
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= threshold) {
            current = section;
          } else {
            break;
          }
        }
      }

      setActiveSection(current.id.replace("about-", ""));
      setShowToTop(page.scrollTop > 420);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    page.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      page.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Keep the current chip visible in the horizontally scrolling mobile index.
  useEffect(() => {
    const strip = mobileIndexRef.current;
    const active = strip?.querySelector(".about-mobile-index-link.is-active");
    if (!strip || !active || strip.clientWidth === 0) return;

    const stripRect = strip.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const targetLeft =
      strip.scrollLeft +
      (activeRect.left - stripRect.left) -
      (strip.clientWidth - activeRect.width) / 2;

    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [activeSection]);

  const jumpToSection = (id) => (event) => {
    event.preventDefault();
    const target = pageRef.current?.querySelector(`#about-${id}`);
    if (!target) return;

    target.scrollIntoView({
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    pageRef.current?.scrollTo({
      top: 0,
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = aboutData.resumeUrl;
    link.download = "Rishabh_Bassi_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewResume = () => {
    onViewResume?.(aboutData.resumeUrl);
  };

  return (
    <div
      id="about"
      className="about-me-page"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
      ref={setRootRef}
      tabIndex={-1}
    >
      <header className="about-topbar">
        <div className="about-topbar-inner">
          <button
            type="button"
            className="about-me-back-button"
            onClick={onClose}
            data-autofocus
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <p className="about-topbar-label">Profile / Rishabh Bassi</p>
          <p className="about-topbar-count">Portfolio · 2026</p>
        </div>
      </header>

      <div className="about-me-container">
        <header className="about-hero">
          <div className="about-hero-grid">
            <div className="about-hero-copy">
              <p className="about-eyebrow">About / Profile</p>
              <h1 className="about-me-title" id="about-title">
                Rishabh
                <br />
                <span>Bassi.</span>
              </h1>
              <p className="about-hero-role">{aboutData.title}</p>
              <p className="about-hero-lede">
                I build across data, AI, and product — where clear thinking
                meets expressive craft.
              </p>

              <div className="about-hero-actions">
                <a
                  className="about-action about-action-primary"
                  href={`mailto:${aboutData.email}`}
                >
                  Email me <span aria-hidden="true">↗</span>
                </a>
                <button
                  type="button"
                  className="about-action about-action-secondary"
                  onClick={handleViewResume}
                >
                  View resume <span aria-hidden="true">↗</span>
                </button>
                <button
                  type="button"
                  className="about-action about-action-quiet"
                  onClick={handleResumeDownload}
                  aria-label="Download resume as a PDF"
                >
                  Download <span aria-hidden="true">↓</span>
                </button>
              </div>

              <dl className="about-hero-meta">
                <div>
                  <dt>Based in</dt>
                  <dd>{aboutData.location}</dd>
                </div>
                <div>
                  <dt>Focus</dt>
                  <dd>Data, AI, product, and interface design</dd>
                </div>
                <div>
                  <dt>Elsewhere</dt>
                  <dd>
                    <a
                      href={aboutData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn <span aria-hidden="true">↗</span>
                    </a>
                    {" · "}
                    <a
                      href={aboutData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub <span aria-hidden="true">↗</span>
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <figure className="about-portrait">
              <div className="about-portrait-frame">
                <img
                  src={rishabhImage}
                  alt="Rishabh Bassi in front of The Connaught, High Street"
                  width="768"
                  height="1024"
                />
              </div>
              <figcaption>
                <span>Fig. 01</span>
                {aboutData.location}
              </figcaption>
            </figure>
          </div>

          <div className="about-facts" aria-label="Profile at a glance">
            {PROFILE_FACTS.map((fact) => (
              <div className="about-fact" key={fact.label}>
                <p className="about-fact-value">{fact.value}</p>
                <p className="about-fact-label">{fact.label}</p>
                <p className="about-fact-note">{fact.note}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="about-body">
          <aside className="about-rail" aria-label="Profile contents">
            <p className="about-rail-label">Contents</p>
            <nav className="about-index-nav" aria-label="Profile sections">
              {ABOUT_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <a
                    className={`about-index-link${isActive ? " is-active" : ""}`}
                    href={`#about-${section.id}`}
                    key={section.id}
                    onClick={jumpToSection(section.id)}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span aria-hidden="true">{section.number}</span>
                    {section.label}
                    <span className="about-index-dot" aria-hidden="true" />
                  </a>
                );
              })}
            </nav>
            <div className="about-rail-note">
              <p>Currently</p>
              <p>Building data and AI solutions at Tata Consultancy Services.</p>
            </div>
          </aside>

          <div className="about-content">
            <nav className="about-mobile-index" aria-label="Profile sections">
              <p className="about-mobile-index-label">
                <span>Contents</span>
                <span className="about-mobile-index-count">
                  {ABOUT_SECTIONS.find((s) => s.id === activeSection)?.number ??
                    "01"}{" "}
                  / {String(ABOUT_SECTIONS.length).padStart(2, "0")}
                </span>
              </p>
              <div className="about-mobile-index-links" ref={mobileIndexRef}>
                {ABOUT_SECTIONS.map((section) => {
                  const isActive = activeSection === section.id;

                  return (
                    <a
                      className={`about-mobile-index-link${isActive ? " is-active" : ""}`}
                      href={`#about-${section.id}`}
                      key={section.id}
                      onClick={jumpToSection(section.id)}
                      aria-current={isActive ? "location" : undefined}
                    >
                      <span aria-hidden="true">{section.number}</span>
                      {section.label}
                    </a>
                  );
                })}
              </div>
            </nav>

            <section
              className="about-section"
              id="about-profile"
              aria-labelledby="about-profile-title"
            >
              <SectionHeading
                section={ABOUT_SECTIONS[0]}
                title="Profile"
                note="The person behind the work — in their own words."
              />
              <p className="about-bio-lede">
                I&apos;m Rishabh Bassi — someone who loves creating things that
                feel thoughtful, purposeful, and a little bit artistic.
                I&apos;ve always lived in the space where design and technology
                overlap, where ideas start fuzzy and become something real.
                Whether I&apos;m shaping interfaces, building systems, or
                experimenting with data, I&apos;m driven by curiosity and the
                excitement of making something that actually works for people.
              </p>
              <p className="about-bio-copy">
                Beyond the screen, I&apos;m a state-level basketball player and
                a singer who&apos;s been lucky enough to perform
                internationally. Those experiences taught me discipline,
                confidence, and the joy of expression — the same qualities I try
                to bring into every project I touch.
              </p>
              <blockquote className="about-bio-quote">
                <p>
                  Creativity isn&apos;t a skill; it&apos;s the way I move
                  through the world.
                </p>
              </blockquote>
            </section>

            <section
              className="about-section"
              id="about-experience"
              aria-labelledby="about-experience-title"
            >
              <SectionHeading
                section={ABOUT_SECTIONS[1]}
                title="Experience"
                note="Five roles across AI engineering, product, research, and analytics."
              />
              <ul className="about-experience-list">
                {aboutData.workExperience.map((entry, index) => (
                  <ExperienceItem
                    entry={entry}
                    index={index}
                    key={`${entry.role}-${entry.company}`}
                  />
                ))}
              </ul>
            </section>

            <section
              className="about-section"
              id="about-projects"
              aria-labelledby="about-projects-title"
            >
              <SectionHeading
                section={ABOUT_SECTIONS[2]}
                title="Projects"
                note="Six builds spanning geospatial ML, healthcare AI, data engineering, churn analytics, agentic finance, and consumer insights."
              />
              <div className="about-projects-grid">
                {aboutData.projects.map((project, index) => (
                  <ProjectCard
                    project={project}
                    index={index}
                    key={project.title}
                  />
                ))}
              </div>
            </section>

            <section
              className="about-section"
              id="about-leadership"
              aria-labelledby="about-leadership-title"
            >
              <SectionHeading
                section={ABOUT_SECTIONS[3]}
                title="Leadership"
                note="Building communities, events, and creative teams."
              />
              <div className="about-leadership-grid">
                {aboutData.leadership.map((entry, index) => (
                  <LeadershipItem
                    entry={entry}
                    index={index}
                    key={`${entry.role}-${entry.organization}`}
                  />
                ))}
              </div>
            </section>

            <section
              className="about-section"
              id="about-skills"
              aria-labelledby="about-skills-title"
            >
              <SectionHeading
                section={ABOUT_SECTIONS[4]}
                title="Skills"
                note="The toolkit behind the work."
              />
              <div className="about-skills-list">
                {aboutData.skills.map((group) => (
                  <div className="about-skill-group" key={group.title}>
                    <h3>{group.title}</h3>
                    <ul>
                      {group.items.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="about-section"
              id="about-education"
              aria-labelledby="about-education-title"
            >
              <SectionHeading
                section={ABOUT_SECTIONS[5]}
                title="Education"
                note="Formal training in computer science and data analytics."
              />
              <ul className="about-education-list">
                {aboutData.education.map((entry, index) => (
                  <li className="about-education-item" key={entry.degree}>
                    <p className="about-education-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div className="about-education-main">
                      <h3>{entry.degree}</h3>
                      <p>{entry.institution}</p>
                    </div>
                    <p className="about-education-period">
                      {formatPeriod(entry.period)}
                    </p>
                    <p className="about-education-details">{entry.details}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="about-section"
              id="about-recognition"
              aria-labelledby="about-recognition-title"
            >
              <SectionHeading
                section={ABOUT_SECTIONS[6]}
                title="Recognition"
                note="Awards and certifications earned along the way."
              />
              <div className="about-recognition-grid">
                <RecognitionList
                  title="Awards"
                  items={aboutData.awards}
                />
                <RecognitionList
                  title="Certifications"
                  items={aboutData.certifications}
                />
              </div>
            </section>

            <section
              className="about-contact"
              id="about-contact"
              aria-labelledby="about-contact-title"
            >
              <div className="about-contact-head">
                <p className="about-contact-kicker">08 / Contact</p>
                <h2 id="about-contact-title">Have something in mind?</h2>
                <p>
                  For roles, collaborations, or a considered conversation,
                  reach me directly.
                </p>
              </div>

              <div className="about-contact-links">
                <a
                  className="about-contact-link about-contact-email"
                  href={`mailto:${aboutData.email}`}
                >
                  <span>Email</span>
                  <strong>{aboutData.email}</strong>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="about-contact-link"
                  href="tel:+918529177707"
                >
                  <span>Phone</span>
                  <strong>{aboutData.phone}</strong>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="about-contact-link"
                  href={aboutData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>LinkedIn</span>
                  <strong>Rishabh Bassi</strong>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="about-contact-link"
                  href={aboutData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>GitHub</span>
                  <strong>rishabhbassi</strong>
                  <span aria-hidden="true">↗</span>
                </a>
                <p className="about-contact-link about-contact-location">
                  <span>Based in</span>
                  <strong>{aboutData.location}</strong>
                </p>
                <p className="about-contact-link about-contact-location">
                  <span>Timezone</span>
                  <strong>IST · GMT+5:30</strong>
                </p>
              </div>

              <div className="about-contact-actions">
                <button
                  type="button"
                  className="about-contact-action about-contact-action-primary"
                  onClick={handleViewResume}
                >
                  View resume <span aria-hidden="true">↗</span>
                </button>
                <button
                  type="button"
                  className="about-contact-action about-contact-action-secondary"
                  onClick={handleResumeDownload}
                >
                  Download PDF <span aria-hidden="true">↓</span>
                </button>
              </div>
            </section>

            <div className="about-page-end">
              <p>End of profile / {aboutData.name}</p>
              <button type="button" onClick={onClose}>
                Back to portfolio <span aria-hidden="true">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showToTop && (
        <button
          type="button"
          className="about-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}
    </div>
  );
}
