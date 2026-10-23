# Updating the site

All site copy lives in plain JavaScript objects at the top of the component that
renders it. Nothing is fetched from a CMS, so an update is: edit the data, check
it at `npm run dev`, then commit and push.

## Resume

- **Master (edit this):** `content-src/resume/Rishabh-Resume-D&AI.docx`
- **What the site serves:** `src/assets/Rishabh_Bassi_Resume.pdf`

Update flow:

1. Edit the `.docx` in `content-src/resume/`.
2. Export it as a PDF named exactly `Rishabh_Bassi_Resume.pdf`.
3. Replace `src/assets/Rishabh_Bassi_Resume.pdf` with the export.
4. The About page's **View resume** and **Download** buttons pick it up
   automatically — the path is imported once in `src/components/AboutMe.jsx`.

The previous resume is kept at
`content-src/resume/Rishabh_Bassi_Resume_NonTech_archive.pdf` for reference.
It is not shipped in the build.

> The About page itself (`aboutData` in `src/components/AboutMe.jsx`) is
> hand-written copy, not generated from the PDF. When a new resume changes the
> story — title, roles, projects — decide what the site should say before
> editing it.

## About page

File: `src/components/AboutMe.jsx` → `aboutData` (top of the file).

| Key | Controls |
| --- | --- |
| `title`, `credential`, `currentRole`, `email`, `phone`, `location`, `linkedin`, `github` | Hero and contact block |
| `workExperience` | Experience section |
| `projects` | Projects section |
| `leadership` | Leadership section |
| `skills` | Skills groups |
| `education`, `awards`, `certifications` | Education and recognition |
| `resumeUrl` | Imported PDF used by the resume buttons |

`credential` is an object with `degree`, `detail`, and `school`; it renders as
the small education line under the hero role.

Add an entry by copying an existing object and editing its fields. Section
numbers and the desktop rail update on their own.

## Side Quests

File: `src/components/SideQuests.jsx` → `SIDE_QUESTS`.

1. Put the cover in `src/assets/side-quests/`, e.g. `my-project.webp`.
2. Import it at the top of the file.
3. Copy a project object and give it a unique `id`, the next `index`, copy,
   `tags`, `image`, `imageAlt`, and the live `url`.

Cover spec: **900 × 625 px**. Screenshots can be sent as-is; they get framed on
a blurred background so nothing is cropped. Source screenshots are archived in
`content-src/side-quests/`.

## Research

Files: `src/data/researchPapers.js` (copy) and the PDF in `src/assets/`.

Add a paper object with `id`, `index`, `title`, `authors`, `date`, `pages`,
`type`, `field`, `lede`, `summary`, `tags`, `sections`, and a `pdfUrl` import.
The Research section builds the list and the reading view from that data.

## Case studies

- Index card: `src/components/case-studies/CaseStudiesPage.jsx`
- Detail page: one component per study, e.g.
  `src/components/case-studies/SurgePricingCaseStudy.jsx`
- Open/close routing: `src/components/HomePage.jsx` (`ROUTES`, lazy import,
  render block)

A second case study needs its own detail component, a lazy import, a route
entry, and a card in the index.

## Homepage

- Hero copy: `src/components/Hero.jsx`
- Disciplines menu (Design / Research / Case Studies):
  `WORK_ITEMS` in `src/components/HomePage.jsx`
- Footer nav: `src/components/Footer.jsx`

## Assets

```
src/assets/                 shipped images and PDFs
src/assets/side-quests/     side-quest source covers (900 × 625 webp)
src/assets/design-portfolio/ portfolio boards
content-src/                editable masters, not shipped
  resume/                   resume .docx + archived PDFs
  side-quests/              raw screenshots used to make covers
```

## Publishing

- `npm run dev` — local preview at http://localhost:5173
- `npm run build` — checks that everything compiles
- `npm run lint` — catches React mistakes before they ship
- Push to `main` to deploy on Vercel.

Keep screenshots out of the repo root; send them over and they will be filed
under `content-src/` and turned into site-ready assets.
