# tolga-portfolio

## Local dev
npm install
npm run dev

Opens at http://localhost:5173

## CV PDFs
There are four CVs, one per kind of role (operations, product, marketing,
commercial). The facts they share live in `cv/content.mjs`; each variant in
`cv/variants/` sets its own title, profile, order, bullets and skills.
`cv/build.mjs` writes one HTML page per variant to `cv/build/`, and

    sh scripts/cv-pdf.sh

prints them to `public/cv/tolga-cakan-cv-<variant>.pdf` with headless Chrome
(the first variant is also copied to `public/tolga-cakan-cv.pdf`). The script
fails if any CV no longer fits on one A4 page.

## Deploy to Vercel
Push this folder to a GitHub repo, then import it in Vercel.
Vite is auto-detected, no config needed.
Add tolgacakan.dev as the custom domain from the Vercel project's Domains tab.
