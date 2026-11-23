#!/usr/bin/env bash
# Copies the game from the repository root into ios-app/www.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p www
find www -mindepth 1 -delete
cp ../index.html ../version.txt ../manifest.webmanifest www/
cp ../icon-180.png ../icon-192.png ../icon-512.png www/
cp -R ../a ../s ../f www/
echo "www ready: $(du -sh www | cut -f1)"
