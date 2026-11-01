#!/usr/bin/env bash
# Restore everything a fresh clone needs: Remotion deps and the Remotion agent skills.
set -euo pipefail
cd "$(dirname "$0")/.."

(cd video && npm install)

# Re-fetch the upstream Remotion skills (pinned in skills-lock.json).
npx -y skills experimental_install

echo
echo "Done. Start Claude Code here, run /mcp, and authenticate the three Meta servers."
