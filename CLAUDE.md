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
- Design direction (updated by the owner on 16 Oct 2026): an immersive, award-level site in the spirit of lusion.co and resn.co.nz,
  not a typical website. Dark ink headers and chapters with a live WebGL scene of real molecular structures; content pages keep a
  light body for reading. Square buttons, hairline rules, red used for actions and numbers, Highlight #FFC72C only as a small
  specimen marker. Still no particle-noise backgrounds, gradient text, pill tags, emoji or monospace labels. Every 3D scene carries
  an honest "specimen" caption (what the structure is, and whether it is real data or a built model).
- Every menu item must open its **own page** (no single-page scrolling navigation).

## Files
| File | Content |
|---|---|
| index.html | Home: logo loader, fixed WebGL stage, hero, 5 service chapters that morph the scene, MD graph reel, responsibility pledge, founder, final mark chapter |
| about.html | Company story, company facts, figures, About the founder |
| services.html | 8 service lines as a hover-preview index (rows link to each service page), turnaround list, how a project runs, reviewer-revision band |
| molecular-docking.html, dft-quantum-chemistry.html, bioinformatics-genomics.html, network-pharmacology.html, vaccine-design.html, ai-cheminformatics.html | One page per service: steps, deliverables, turnaround, tools (only tools named elsewhere on the site), who works on it, Service JSON-LD |
| molecular-dynamics.html | MD service page: protein–ligand/MM-PBSA deliverables, report excerpts (from the real report), 23 graphs from a 100 ns GROMACS run |
| training.html | Figures, latest training (Cohort 3), previous trainings |
| team.html | At a glance, founder, 7 experts, legal advisor, campus-network band (all bios in 3rd person; photos in assets/img/team/) |
| campus-network.html | The 26 independent sales representatives as compact cards (moved off team.html) |
| research.html | 4 featured papers, journals, link to founder.html#publications |
| contact.html | Email directory + project brief form: direct submit via Web3Forms once data-web3forms-key is filled in, otherwise the email app; WhatsApp send; ?service= pre-selects |
| founder.html | Full profile of the founder: about, awards, 32 publications with search, NCBI records, talks, skills, courses (no degrees, no work history) |
| credits.html | Sources and licences for every 3D structure, the graphs and the typeface |
| faq.html | 14 questions and answers (files, turnaround, deliverables, publishing, confidentiality, trainings, SECP) |
| privacy.html, cookies.html, terms.html, disclaimer.html, refunds.html | Legal pages. terms.html has #responsibility and #copyright. Drafts: the owner and legal advisor should review them |
| 404.html | Not-found page |
| assets/css/style.css | Shared styles; assets/css/founder.css only for founder.html |
| assets/js/main.js | Menu overlay, nav state, Lahore clock, reveals, cursor, magnetic buttons, service peek, MD reel, loader, copy buttons, brief composer, publication search |
| assets/js/matter.js | WebGL scene: 1,656 points that morph between protein (real AdK open↔closed trajectory), gold nanoparticle, B-DNA, network, DPPC vesicle and the BioInfoX mark |
| assets/data/matter.bin | Point data for the scene, built by tools/build_matter.py from MDAnalysis test data (LGPL) and exact geometry |
| assets/img/matter/ | Still renders of each scene state (service previews and no-WebGL fallback) |
| assets/md/ | MD graphs: png/ and pdf/ originals, -900/-1600 .webp web copies, md-analysis-report.html (not linked) |
| assets/img/ | Logo SVGs, founder photo (webp), favicons, og-image.jpg (1200×630 sharing image) |
| tools/build_matter.py | Rebuilds assets/data/matter.bin (not published: excluded in _config.yml) |
| favicon.ico, site.webmanifest, robots.txt, sitemap.xml, .htaccess, _config.yml | Launch files. .htaccess forces https://www and sets the 404 page (Hostinger only) |
| README.txt | Plain-language upload instructions (cPanel/Hostinger, Netlify, GitHub Pages) |

Nav (quick links on desktop >1100px + full-screen menu), footer and <head> are repeated in every page: change them in **all** HTML files.
Never embed images as base64 in HTML (it made team.html 1 MB); save them as files in assets/img/.
Canonical domain is https://bioinfoxlab.org/ (no www). robots.txt allows search and AI crawlers; llms.txt summarises the company.
Training text uses data-phases / data-phases-href (main.js) to switch after the registration deadline and after the cohort ends.
Inner pages have a dark `.page-head` with `<canvas class="matter" data-matter="protein|gold|dna|network|vesicle|mark">` and a `.specimen` caption.
Three MD graphs are kept but not shown because they are flawed: 05_rmsd_matrix_2d (empty), 11_clusters (0–0.1 ns axis), 09_pca_residue_contribution (stray line).

## Company facts (approved by the owner)
- Legal name: BioInfoX (SMC-Private) Limited. Tagline: Empowering Bioinformatics.
- Wording: "one of the pioneering bioinformatics companies in Pakistan and the first based in Lahore". Never call it simply "a pioneering company".
- SECP: incorporated 25 August 2026 under the Companies Act, 2017, company limited by shares, CUIN 0352412
  (verify: https://leap.secp.gov.pk/#/verify-company-info/0352412). Show the facts only; never publish the certificate image. Working since 2022.
- Typical turnaround (one standard system): docking 2 days; MD 3 days per 100 ns, runs 100–2,000 ns, up to 10 in parallel (owner);
  DFT 2 days (owner); bioinformatics 3–5 days; network pharmacology 3 days; immunoinformatics 5 days; AI/cheminformatics 5–7 days;
  training on schedule. The ones not marked "owner" are estimates to confirm with the owner.
- WhatsApp button (.wa, bottom right) on every page: https://wa.me/923092529763
- Owner's statement (home pledge, terms, FAQ): "We take full responsibility for every analysis we perform; world-class analysis that
  can be challenged anywhere." Interpreted on the site as: errors on our side are corrected and rerun at no charge.
- Google Analytics (G-FBK9JSM1T1) was added by the owner on 16 Oct 2026, plus Organization JSON-LD and a Google verification file.
  privacy.html and cookies.html describe it (_ga cookies, no advertising). There is still no consent banner: changing the tag
  (Consent Mode / banner) needs the owner's explicit go-ahead.
- Montserrat is self-hosted (assets/fonts/, variable woff2, OFL). Do not go back to Google Fonts.
- Performance: matter.js adapts its render scale to the frame time (phones max 1.5x DPR, weak devices start at 75 %),
  skips drawing while a .solid section covers the stage and re-uploads data only when the shape changes. On touch screens the
  grain is static and the nav has no backdrop blur. Long lower sections use content-visibility:auto.
- Working since 2022, serving researchers worldwide. Trainings are online, for participants in Pakistan.
- More than 1,000 projects completed for researchers worldwide. We help researchers publish their research papers.
- 2,000+ students trained ("thousands of students"), 200 interns.
- Location shown on site: Lahore, Pakistan (brand kit). Owner's office is in Sheikhupura — confirm which to show.
- Emails: info@bioinfoxlab.org (general), simulations@bioinfoxlab.org (simulation projects),
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
- **Do not list his degrees or work experience anywhere** (no M.Sc./B.Sc., no Gold Medal for a degree, no past jobs).
- He has **left** MBBL Lab (University of Central Punjab) and The University of Lahore: never show them as his affiliations.
  Event venues in his talks list and the MBBL strain names of his NCBI genomes are fine.
- 36 peer-reviewed articles, 200 citations, h-index 10, i10-index 7 (Google Scholar, owner update 18 Oct 2026); the site lists 32 of them. Best Research Student Award 2024 (University of Okara).
- Publications #26 and #27 lack journal names and #15 truncates before his name: ask the owner for the details.
- Contact: director@bioinfoxlab.org, +92 309 2529763, LinkedIn https://www.linkedin.com/in/thenoumanmajeed/
- Photo: assets/img/muhammad-nouman-majeed.webp (black suit, maroon tie, background removed).
- Never publish his passport number, date of birth, home address, or any references/referees (no names, no contact details).

## Team
- Shoaib Siddique, PhD — Head of Computational Physics and Materials Science. PhD Physics, National Yunlin University of Science and Technology (YunTech), Taiwan. Photocatalysts, perovskite solar cells, supercapacitor electrodes, SERS. Scholar: https://scholar.google.com/citations?user=LjLHAoMAAAAJ&hl=en
- Mohsin Raza — Scientific Research Advisor. Doctoral Researcher in Physics, Universitat de Barcelona (from Aug 2026); previously research assistant, Sejong University, South Korea. LinkedIn: https://www.linkedin.com/in/mohsin-raza-researcher/
- Zeeshan Ghani — Legal Advisor, Advocate High Court.
- Photos: assets/img/shoaib-siddique.webp (navy suit, glasses) and assets/img/mohsin-raza.webp (no glasses; source is only 237×254, ask for a larger one). assets/img/zeeshan-ghani.webp (Zeeshan, office photo, small source).

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
