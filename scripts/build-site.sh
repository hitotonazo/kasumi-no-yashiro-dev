#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_dir"

sass --style=compressed --no-source-map assets/scss/style.scss assets/css/style.css

rm -rf dist
mkdir -p dist/assets/css dist/assets/js dist/assets/images dist/modules/site-alteration

cp ./*.html dist/
cp assets/css/style.css dist/assets/css/
cp assets/js/*.js dist/assets/js/
cp assets/images/*.webp dist/assets/images/
cp assets/images/favicon-hanasumi.png dist/assets/images/
cp modules/site-alteration/site-alteration.css modules/site-alteration/site-alteration.js dist/modules/site-alteration/

cat > dist/_headers <<'HEADERS'
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
HEADERS

echo "Production site built in dist/"
