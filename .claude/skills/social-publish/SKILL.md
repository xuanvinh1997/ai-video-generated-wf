---
name: social-publish
description: Rules for using the Meta MCP servers (ads, social technologies, WhatsApp) with finished videos. Use before any distribution, ad, or messaging action.
---

## What the connected servers can do
Configured in `.mcp.json`; authenticate each once with `/mcp` (Meta OAuth).

| Server | Use for |
|---|---|
| `meta_ads` | Reporting, campaigns/ad sets/ads, catalogs, A/B tests, activity logs |
| `meta_social_technologies` | App settings, App Review status, webhooks, API health, docs search |
| `whatsapp_business_tools` (beta) | Templates, phone numbers, webhooks, sending messages |

None of these documents a tool for posting a video to a Facebook Page or Instagram feed. Do not claim you can publish organically through MCP. If the user wants that, say so and propose either the Graph API directly or manual upload of `out/<slug>.mp4`. Check the tool list with `/mcp` first; Meta may have added tools since this was written.

## Safety rules
- Ads create real spend and messages reach real people. Before any create/update/send call, state exactly what will be done (account, audience, budget, copy, file) and wait for explicit user approval.
- Prefer creating ads/campaigns in a paused state when the tool allows it.
- Never send WhatsApp messages to numbers the user did not name.
- Read scope is the default. If a tool fails for lack of Manage scope, tell the user; do not try to work around it. Scopes are changed by the user under Facebook Settings > Business Integrations.
- Never write tokens (e.g. from `system_user_token`) to files or logs.

## Pre-publish checklist
- Rendered file exists in `out/` and matches the brief's ratio, length and size. Produce it with `cd video && node scripts/export.mjs <slug> --preset reels|feed|landscape`; every check must print PASS. Its limits come from third-party guides, so confirm them against Meta's Ads Guide before spending money.
- Captions burned in or provided, since most feed video plays muted.
- Copy and CTA match the brief; assets are licensed for the use.
- User has approved the final render.
