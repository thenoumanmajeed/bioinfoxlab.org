# BioInfoX website — project context

Static multi-page website for **BioInfoX (SMC-Private) Limited** (www.bioinfoxlab.org).
Owner: Muhammad Nouman Majeed. Plain HTML/CSS/JS, no build step, no framework.

## Rules that always apply
- No AI or assistant attribution anywhere in the site: no generator tags, no comments, no "made with" marks.
- Brand rules (from the brand kit, /Users/noumanistics/Desktop/brandkit on the owner's Mac):
  - One typeface only: **Montserrat** (400/500/600/700/800). Never add a second font.
  - Colours: Brand Red #D5001C (rules, numbers, buttons), Bright Red #F01B33 (accents on dark only),
    Ink Black #15161B, Slate Grey #454C57, Paper #F5F6F8, Highlight #FFC72C.
  - Magenta #E8189B and Purple #7B2FF7 exist **only inside the gradient on the X of the logo**. Never use them as fills or gradient text.
  - Use the standard logo on light backgrounds and the "for_dark_bg" logo on dark ones. Never recolour, stretch or add effects.
  - Full legal name on legal/financial text; "BioInfoX" alone everywhere else.
- Design direction the owner approved: light, editorial, "research institute" look. Narrow label column + wide content,
  hairline rules, square buttons, red used sparingly. Avoid the generic AI look: no particle backgrounds, no gradient text,
  no pill tags, no emoji, no monospace eyebrow labels, no centred everything.
- Every menu item must open its **own page** (no single-page scrolling navigation).

## Files
| File | Content |
|---|---|
| index.html | Home: hero, figures, services preview, latest training band, About the founder, CTA |
| about.html | Company story, company facts, figures, About the founder |
| services.html | 8 service lines, how a project runs, deliverables |
| training.html | Figures, latest training (Cohort 3), previous trainings |
| team.html | Founder lead + Shoaib Siddique, Mohsin Raza, Zeeshan Ghani |
| research.html | 4 featured papers, journals, link to founder.html#publications |
| contact.html | Email directory + project brief form (opens the visitor's email app) |
| founder.html | Full profile of the founder: roles, experience, education, awards, 32 publications with search, NCBI records, talks, skills, courses, references |
| 404.html | Not-found page |
| assets/css/style.css | Shared styles; assets/css/founder.css only for founder.html |
| assets/js/main.js | Mobile menu, copy buttons, brief composer (contact), publication search (founder) |
| assets/img/ | Logo SVGs, founder photo (webp), favicons, og-image.jpg (1200×630 sharing image) |
| favicon.ico, site.webmanifest, robots.txt, sitemap.xml, .htaccess | Launch files. .htaccess forces https://www and sets the 404 page |
| README.txt | Plain-language upload instructions (cPanel/Hostinger, Netlify, GitHub Pages) |

Nav, footer and <head> are repeated in every page: change them in **all** HTML files.

## Company facts (approved by the owner)
- Legal name: BioInfoX (SMC-Private) Limited. Tagline: Empowering Bioinformatics.
- One of Pakistan's pioneering companies in bioinformatics; the first registered bioinformatics company based in Lahore.
- Working since 2022, serving researchers worldwide. Trainings are online, for participants in Pakistan.
- 2,000+ students trained, 200 interns.
- Location shown on site: Lahore, Pakistan (brand kit). Owner's office is in Sheikhupura — confirm which to show.
- Emails: info@bioinfoxlab.org (general), simulation@bioinfoxlab.org (simulation projects),
  trainings@bioinfoxlab.org (trainings), director@bioinfoxlab.org (founder). Phone/WhatsApp: +92 309 2529763 (only this number).
- Services, in priority order:
  1. Molecular docking — Docking, virtual screening and interaction analysis
  2. Molecular dynamics — Simulation setup, trajectory analysis and binding-energy estimation
  3. DFT and quantum chemistry — Geometry optimization, HOMO–LUMO, MEP and electronic properties
  4. Bioinformatics — Sequence analysis, protein modelling and biological data analysis
  5. Network pharmacology — Target networks, enrichment analysis and Cytoscape visualizations
  6. Immunoinformatics — Epitope prediction and in silico vaccine design
  7. AI and cheminformatics — QSAR, molecular descriptors and predictive models
  8. Training and consulting — Workshops, research guidance and customized training
- Up to 10 MD simulations run in parallel. Simulation deliverables: trajectories and topologies, graphs (images + xmgrace),
  structure snapshots, trajectory movie, written report.

## Founder (how he must be presented)
- Muhammad Nouman Majeed — **Founder and Chief Executive Officer**, leads BioInfoX. Present him as **PhD Scholar**.
- **Do not mention MS Biotechnology anywhere.** M.Sc. Biotechnology (University of Okara, Gold Medalist) is fine.
- Research Associate, The University of Lahore (from Apr 2026); Molecular Dynamics Researcher, MBBL Lab, University of Central Punjab (from Jul 2024).
- 32 peer-reviewed articles, 143 citations, h-index 8, i10-index 7 (Google Scholar). Best Research Student Award 2024 (University of Okara).
- Contact: director@bioinfoxlab.org, +92 309 2529763, LinkedIn https://www.linkedin.com/in/thenoumanmajeed/
- Photo: assets/img/muhammad-nouman-majeed.webp (black suit, maroon tie, background removed).
- Never publish his passport number, date of birth, home address, or referees' phone numbers/emails.

## Team
- Shoaib Siddique, PhD — Head of Computational Physics and Materials Science. PhD Physics, National Yunlin University of Science and Technology (YunTech), Taiwan. Photocatalysts, perovskite solar cells, supercapacitor electrodes, SERS. Scholar: https://scholar.google.com/citations?user=LjLHAoMAAAAJ&hl=en
- Mohsin Raza — Scientific Research Advisor. Doctoral Researcher in Physics, Universitat de Barcelona (from Aug 2026); previously research assistant, Sejong University, South Korea. LinkedIn: https://www.linkedin.com/in/mohsin-raza-researcher/
- Zeeshan Ghani — Legal Advisor, Advocate High Court.
- Team members currently show initials; replace with photos when the owner sends them.

## Trainings
Latest (shown as the only current offer): **Bioinformatics Training Program, Cohort 3**
- 23 October – 20 November 2026, live weekend classes on Google Meet, for participants based in Pakistan.
- Modules: Machine Learning; Immunoinformatics and Vaccine Design; Molecular Dynamics Simulation; Cancer Bioinformatics; Mutation and Variant Analysis.
- Certificate, CV project, mentorship; top performers offered an internship at BioInfoX.
- Fee: PKR 1,000 students, PKR 1,500 faculty and professionals. Registration closes 20 October 2026.
- Register: trainings@bioinfoxlab.org or WhatsApp +92 309 2529763.

Previous trainings (from the owner's own records; web/LinkedIn search found nothing public):
- Oct 2026 — Computational Research and Scientific Writing Training, 2 days, 10–11 Oct 2026, online, free (network pharmacology, AI-assisted scientific writing, manuscript preparation, journal submission).
- Jun–Aug 2026 — 6-Week Bioinformatics Internship, 2026 Cohort, 25 Jun – 10 Aug 2026 (WGS, vaccine design/immunoinformatics, scientific writing, DFT with ORCA, MD with GROMACS).
- Mar 2026 — In-Silico Drug Discovery, hands-on online course (certificates issued).
- Dec 2025 — In-Silico Vaccine Design and Molecular Docking, hands-on online course (certificates issued).

When Cohort 3 ends, update training.html and the "Latest training" band on index.html, and move Cohort 3 into the previous list.

## Open items to confirm with the owner
1. Cohort 3 dates/fees/deadline still correct.
2. Office location on the site: Lahore (current) or Sheikhupura.
3. Any other previous trainings, workshops or courses to list.
4. Photos for Shoaib, Mohsin and Zeeshan.
5. University/field to show next to "PhD Scholar" (currently none is named).
6. Registration form link (Google Form) for Cohort 3, if one should be linked.

## Launch checklist
1. Upload the folder contents (including hidden .htaccess) to public_html, or drag the folder to app.netlify.com/drop.
2. Turn on SSL. 3. Add the site to Google Search Console and submit sitemap.xml. 4. Share the home link once to check the preview image.
