#!/usr/bin/env bash
# Convenience wrapper for launching the WhatsApp companion bot.
# Usage: bash scripts/start-companion.sh [--pm2]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."
BOT="$ROOT/whatsapp-companion/bot.js"

if [[ "${1:-}" == "--pm2" ]]; then
  echo "Starting with pm2..."
  pm2 start "$BOT" --name wa-companion --interpreter node
  pm2 save
  echo "✅  wa-companion started. Run: pm2 logs wa-companion"
else
  echo "Starting in foreground (Ctrl+C to stop)..."
  node "$BOT"
fi
