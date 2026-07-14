#!/usr/bin/env bash
# Deploy the static site to Cloudflare Pages from your machine.
# Prereq: `wrangler login` (one-time). Usage: ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

DIST="$(mktemp -d)"
trap 'rm -rf "$DIST"' EXIT
cp index.html styles.css main.js "$DIST/"
cp -r assets "$DIST/assets"

wrangler pages deploy "$DIST" \
  --project-name=tensorgroup-hugo \
  --branch=main \
  --commit-dirty=true
