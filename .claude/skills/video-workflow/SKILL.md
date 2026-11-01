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

## 4. Preview
Start Remotion Studio (`cd video && npm run dev`) and let the user review. Iterate on feedback.

## 5. Render
Load `remotion-render`. Output to `out/<slug>.mp4` (repo-level `out/`, gitignored), e.g.
`cd video && npx remotion render <composition-id> ../out/<slug>.mp4`.
Check duration, resolution and file size against the brief before reporting done.

## 6. Publish
Only if the user asks. Follow the `social-publish` skill.
