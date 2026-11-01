---
name: video-workflow
description: End-to-end workflow for producing an AI video in this repo, from brief to rendered file. Use when asked to make, create, or produce a video.
---

Pipeline: brief → script → storyboard → build → preview → render → (optional) publish.
Stop at each gate below and show the user the result before moving on.

## 1. Brief
Create `briefs/<slug>.md` with: goal, audience, platform(s), aspect ratio and duration, tone, call to action, brand assets. Ask the user for anything missing instead of guessing. Platform defaults:

| Platform | Ratio | Size | Max length |
|---|---|---|---|
| Reels / Stories / Shorts | 9:16 | 1080x1920 | 90s |
| Feed | 4:5 | 1080x1350 | 60s |
| Landscape | 16:9 | 1920x1080 | any |

## 2. Script and storyboard
Append to the same brief file: a scene table (scene, seconds, on-screen text, visual, audio/voiceover). Gate: user approves the storyboard before any code.

## 3. Build
Work in `video/` only. Load the `remotion-best-practices` skill first; it routes to `remotion-create`, `remotion-markup`, `remotion-captions`, etc.
- One composition per deliverable, `id` equal to the brief slug.
- Put source media in `assets/`, copy what the video needs into `video/public/` and reference it with `staticFile()`.
- Run `cd video && npm run lint` before showing anything.

### Voiceover and AI clips (OpenRouter)
Scripts live in `video/scripts/` and read `OPENROUTER_API_KEY` from the repo-level `.env` (run from `video/` with `node --env-file=../.env`). Models are grouped in `video/scripts/models.json` into tiers `cheap` (default), `standard`, `premium`. **Always start with `cheap`**; move up a tier only when the user asks or the result is not good enough. Show `node --env-file=../.env scripts/models.mjs` for live prices.
- Voiceover: write `video/src/<slug>/voiceover.json` (`{ "lines": [{ "id": "s1", "text": "..." }] }`, optional `tier`, `model`, `voice`, `instructions`), then `node --env-file=../.env scripts/voiceover.mjs <slug> [--tier standard]`. It writes `video/public/<slug>/vo-<id>.mp3` and `src/<slug>/voiceover.generated.json` with each duration. Size each scene from those durations (`calculateMetadata`) so picture and speech stay in sync. Use `--only <id>` to regenerate a single line.
- AI images: write `video/src/<slug>/images.json` (`{ "aspect_ratio": "9:16", "images": [{ "id": "intro", "prompt": "..." }] }`, optional `tier`, `model`), then `node --env-file=../.env scripts/genimage.mjs <slug>`. Without `--yes` it only prints the prompts and price; get user approval before adding `--yes`. Output goes to `video/public/<slug>/art-<id>.jpg`. Ask for "no text, no letters" in prompts, since models draw text badly. Show the user the images before using them. In Remotion, show them with `<Img>` and a slow zoom (see `SceneArt.tsx` in `gioi-thieu-workflow`).
- AI clips: `node --env-file=../.env scripts/genvideo.mjs --prompt "..." --duration 4 --aspect 9:16 --out public/<slug>/clip.mp4`. Without `--yes` it only prints the request and price. Because it spends money, show the user the price and get approval before adding `--yes`. Use `--tier` or `--model` to change model, `--audio` for clips with sound, `--image first.png` to animate a still.
- Prefer code-driven Remotion animation over AI clips when it does the job; AI clips cost per second.

## 4. Preview
Start Remotion Studio (`cd video && npm run dev`) and let the user review. Iterate on feedback.

## 5. Render
Load `remotion-render`. Output to `out/<slug>.mp4` (repo-level `out/`, gitignored), e.g.
`cd video && npx remotion render <composition-id> ../out/<slug>.mp4`.
For Meta (Reels, Stories, Feed) use the export script instead, which renders with H.264/yuv420p/AAC and checks the file:
`cd video && node scripts/export.mjs <slug> --preset reels|feed|landscape` -> `out/<slug>-<preset>.mp4`. `feed` and `landscape` render the compositions `<slug>-feed` (1080x1350) and `<slug>-landscape` (1920x1080), which must exist. Report any FAIL line to the user.
Check duration, resolution and file size against the brief before reporting done. The script cannot check safe zones or captions; look at stills for those.

## 6. Publish
Only if the user asks. Follow the `social-publish` skill.
