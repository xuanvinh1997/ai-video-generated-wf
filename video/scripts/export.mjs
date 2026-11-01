// Render a composition for a Meta placement and check the file against that preset.
//   node scripts/export.mjs <slug> [--preset reels|feed|landscape] [--composition <id>] [--skip-render]
// Output: ../out/<slug>-<preset>.mp4
// reels      -> composition <slug>          1080x1920 (Reels, Stories)
// feed       -> composition <slug>-feed     1080x1350 (Feed 4:5)
// landscape  -> composition <slug>-landscape 1920x1080
// The composition's own size is used, so a placement with a different ratio needs its own composition.
// Limits are from third-party guides, not Meta's Ads Guide. Re-check them before ads or publishing.
import { spawnSync } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "./openrouter.mjs";

const PRESETS = {
  reels: { width: 1080, height: 1920, suffix: "", maxSeconds: 90, label: "Reels / Stories 9:16" },
  feed: { width: 1080, height: 1350, suffix: "-feed", maxSeconds: 60, label: "Feed 4:5" },
  landscape: { width: 1920, height: 1080, suffix: "-landscape", maxSeconds: 240, label: "Landscape 16:9" },
};
const MAX_BYTES = 4 * 1024 ** 3;

const args = parseArgs(process.argv.slice(2));
const slug = args._[0];
const presetName = args.preset ?? "reels";
const preset = PRESETS[presetName];
if (!slug || !preset) {
  throw new Error(`Usage: export.mjs <slug> [--preset ${Object.keys(PRESETS).join("|")}] [--composition id] [--skip-render]`);
}

const composition = args.composition ?? `${slug}${preset.suffix}`;
const out = path.join("..", "out", `${slug}-${presetName}.mp4`);
await mkdir(path.dirname(out), { recursive: true });

const run = (cmd, cmdArgs, opts = {}) => {
  const r = spawnSync(cmd, cmdArgs, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${cmdArgs.join(" ")} failed:\n${r.stderr || r.stdout}`);
  return r.stdout;
};

if (!args["skip-render"]) {
  console.log(`Rendering "${composition}" for ${preset.label} -> ${out}`);
  run(
    "npx",
    [
      "remotion", "render", composition, out,
      "--codec=h264",
      "--pixel-format=yuv420p",
      "--audio-codec=aac",
      "--audio-bitrate=192k",
      "--crf=18",
      "--log=error",
    ],
    { stdio: ["ignore", "inherit", "inherit"] },
  );
}

const probe = JSON.parse(
  run("npx", ["remotion", "ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", out]),
);
const video = probe.streams.find((s) => s.codec_type === "video");
const audio = probe.streams.find((s) => s.codec_type === "audio");
const seconds = Number(probe.format.duration);
const bytes = (await stat(out)).size;
const [num, den] = (video?.r_frame_rate ?? "0/1").split("/").map(Number);
const fps = den ? num / den : 0;

const checks = [
  ["container mp4", /mp4/.test(probe.format.format_name), probe.format.format_name],
  ["video H.264", video?.codec_name === "h264", video?.codec_name],
  ["pixel format yuv420p", video?.pix_fmt === "yuv420p", video?.pix_fmt],
  [`size ${preset.width}x${preset.height}`, video?.width === preset.width && video?.height === preset.height, `${video?.width}x${video?.height}`],
  ["frame rate 24-60", fps >= 24 && fps <= 60, `${fps}`],
  ["audio track AAC", audio?.codec_name === "aac", audio ? `${audio.codec_name} ${audio.sample_rate} Hz` : "none"],
  [`length <= ${preset.maxSeconds}s`, seconds <= preset.maxSeconds, `${seconds.toFixed(2)}s`],
  ["file <= 4 GB", bytes <= MAX_BYTES, `${(bytes / 1024 ** 2).toFixed(1)} MB`],
];

console.log(`\nCheck ${out} against ${preset.label}`);
for (const [name, ok, value] of checks) console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}  (${value})`);
console.log(
  `\nNot checked automatically: keep text out of the top 14%, bottom 35% and sides 6% of vertical video (Reels UI covers it); captions for muted playback; copy and CTA match the brief.`,
);
if (checks.some(([, ok]) => !ok)) process.exitCode = 1;
