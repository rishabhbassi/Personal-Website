# Draft & prototype routes

Preview endpoints for the landing-hero explorations. They work in the Vite
dev server and in production builds.

## Hero drafts

All hero compositions live on one scrollable page: **`/hero-drafts`**

| Draft | URL | What it is |
| --- | --- | --- |
| A | `/hero-drafts#draft-full` | Full bleed |
| B | `/hero-drafts#draft-center` | Centerline |
| C | `/hero-drafts#draft-masthead` | Masthead |
| D | `/hero-drafts#draft-masthead-bleed` | Masthead bleed |
| E | `/hero-drafts#draft-blend` | Blended |
| F | `/hero-drafts#draft-masthead-blend` | Previous landing — masthead hero with the R1 role line |
| G | `/hero-drafts#draft-latest` | Latest landing — R2 index cells and the partition cut above the lede |

Shorthand: `/#draft-latest` and the other `draft-*` anchors also open the
drafts page at that section.

Draft F renders `MastheadHeroClassic.jsx`; draft G renders `MastheadHero.jsx`.
The live home page uses the original memoji hero in `Hero.jsx`.

## Static layout studies

| URL | File | What it is |
| --- | --- | --- |
| `/partition-variants.html` | `public/partition-variants.html` | Four partition layouts × six role-line treatments (R1–R6), with a live mode toggle |
| `/partition-cut.html` | `public/partition-cut.html` | Quick prototype of the chosen cut: R2 cells stop at the image; the partition rule sits above the lede |
