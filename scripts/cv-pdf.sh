#!/bin/sh
# Renders cv/cv.html to public/tolga-cakan-cv.pdf with headless Chrome,
# then checks that the result is still a single A4 page.
set -e
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="public/tolga-cakan-cv.pdf"

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="$OUT" "file://$PWD/cv/cv.html" 2>/dev/null

PAGES=$(grep -ao "/Count [0-9]*" "$OUT" | head -1 | cut -d" " -f2)
echo "$OUT: $PAGES page(s), $(wc -c < "$OUT" | tr -d ' ') bytes"
[ "$PAGES" = "1" ] || { echo "CV must fit on one page" >&2; exit 1; }
