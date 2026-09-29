#!/bin/sh
# Builds every CV variant (cv/content.mjs + cv/variants/*) and prints each to
# public/cv/tolga-cakan-cv-<slug>.pdf with headless Chrome. The first variant
# is also copied to public/tolga-cakan-cv.pdf. Fails if any CV runs past one A4 page.
set -e
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p public/cv

node cv/build.mjs > /dev/null
first=""
for html in $(node -e 'import("./cv/content.mjs").then(m => console.log(m.variants.map(v => v.slug).join(" ")))'); do
  out="public/cv/tolga-cakan-cv-$html.pdf"
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
    --print-to-pdf="$out" "file://$PWD/cv/build/$html.html" 2>/dev/null
  pages=$(grep -ao "/Count [0-9]*" "$out" | head -1 | cut -d" " -f2)
  echo "$out: $pages page(s), $(wc -c < "$out" | tr -d ' ') bytes"
  [ "$pages" = "1" ] || { echo "$html CV must fit on one page" >&2; exit 1; }
  [ -n "$first" ] || first="$out"
done
cp "$first" public/tolga-cakan-cv.pdf
