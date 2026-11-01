# AI video generation workflow

Coding-agent workspace for producing videos with Remotion (React) and distributing them through Meta's MCP servers.

## Layout
- `video/`: the Remotion project (`src/Root.tsx` registers compositions). All video code goes here.
- `briefs/`: one markdown brief per video (goal, storyboard, copy).
- `assets/`: raw source media (gitignored). Copy what a video uses into `video/public/`.
- `out/`: rendered files (gitignored).
- `.claude/skills/`: `remotion-*` (upstream, from `remotion-dev/skills`, locked in `skills-lock.json`) and our own `video-workflow` and `social-publish`.
- `.mcp.json`: Meta MCP servers `meta_ads`, `meta_social_technologies`, `whatsapp_business_tools`. OAuth via `/mcp`.

## Rules
- To make a video, start with the `video-workflow` skill. For Remotion code, start with `remotion-best-practices`.
- Do not hand-edit upstream `remotion-*` skills; update them with `npx skills update`.
- The hosted Remotion MCP server was shut down (2026-10-26). Use the `remotion-docs` skill for documentation, not an MCP.
- Run `cd video && npm run lint` before reporting a composition as done.
- Anything that spends money or messages people (Meta Ads, WhatsApp) needs explicit user approval first; see `social-publish`.
- Voiceover and AI clips go through OpenRouter (`video/scripts/`, key in `.env`). Model tiers are in `video/scripts/models.json`; default to the `cheap` tier. `genimage.mjs` and `genvideo.mjs` need `--yes` to spend money, so get user approval first.
