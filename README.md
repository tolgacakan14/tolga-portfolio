# tolga-portfolio

## Local dev
npm install
npm run dev

Opens at http://localhost:5173

## CV PDF
The downloadable CV is written in `cv/cv.html` (fonts in `cv/fonts`) and
rendered to `public/tolga-cakan-cv.pdf` with headless Chrome:

    sh scripts/cv-pdf.sh

The script fails if the CV no longer fits on one A4 page.

## Deploy to Vercel
Push this folder to a GitHub repo, then import it in Vercel.
Vite is auto-detected, no config needed.
Add tolgacakan.dev as the custom domain from the Vercel project's Domains tab.
