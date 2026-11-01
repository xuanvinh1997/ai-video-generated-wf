# ai-video-generated-wf

Workspace for coding agents (Claude Code) to produce AI-generated videos with [Remotion](https://github.com/remotion-dev/remotion) and work with Meta's [MCP servers](https://developers.facebook.com/documentation/mcp).

```
.
├── CLAUDE.md                 agent instructions
├── .mcp.json                 Meta MCP servers (ads, social technologies, WhatsApp)
├── .claude/skills/
│   ├── remotion-*            upstream Remotion skills (remotion-dev/skills)
│   ├── video-workflow        brief → storyboard → build → render
│   └── social-publish        safety rules and checklist for Meta MCPs
├── video/                    Remotion project
├── briefs/                   video briefs
├── assets/                   raw media (gitignored)
├── out/                      rendered videos (gitignored)
└── scripts/setup.sh          fresh-clone setup
```

## Setup
```bash
./scripts/setup.sh
claude        # then run /mcp and authenticate the three Meta servers
```
Requires Node 20.19+ / 22.13+ / 24+.

## Usage
Ask the agent, e.g. "Make a 30s vertical promo video for X", and it follows `video-workflow`. Preview with `cd video && npm run dev`.

## Notes
- Remotion's hosted MCP server was discontinued on 2026-10-26; Remotion now ships agent skills instead.
- The Meta MCP servers cover ads, app/webhook management and WhatsApp. None documents a tool for posting organic videos to a Page or Instagram feed; check `/mcp` for current tools.
- Remotion is free for teams of up to 3; see the [license](https://www.remotion.pro/license).
