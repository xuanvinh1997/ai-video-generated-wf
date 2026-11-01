// Generate one voiceover mp3 per line and record each duration so scenes can be sized to the audio.
//   node --env-file=../.env scripts/voiceover.mjs <slug> [--tier cheap|standard|premium] [--model id] [--voice name] [--only <id>]
// Reads  src/<slug>/voiceover.json  { tier?, model?, voice?, instructions?, speed?, lines: [{ id, text }] }
// Model comes from scripts/models.json (default tier: cheap) unless overridden. See scripts/models.mjs.
// Writes public/<slug>/vo-<id>.mp3 and src/<slug>/voiceover.generated.json (durations).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";
import { resolveModel, speechCatalog } from "./models.mjs";
import { orFetch, parseArgs } from "./openrouter.mjs";

const args = parseArgs(process.argv.slice(2));
const slug = args._[0];
if (!slug) throw new Error("Usage: voiceover.mjs <slug> [--tier t] [--model id] [--voice v] [--only <id>]");

const specPath = path.join("src", slug, "voiceover.json");
const spec = JSON.parse(await readFile(specPath, "utf8"));

const chosen = resolveModel("tts", { args, spec });
const entry = (await speechCatalog()).find((m) => m.id === chosen.model);
if (!entry) throw new Error(`Model ${chosen.model} is not in the OpenRouter speech catalog`);
if (!chosen.voice) throw new Error(`No voice set for ${chosen.model}. Pass --voice or set "voice" in ${specPath}`);
if (entry.supported_voices && !entry.supported_voices.includes(chosen.voice)) {
  throw new Error(`Voice "${chosen.voice}" not supported by ${chosen.model}. Options: ${entry.supported_voices.join(", ")}`);
}
console.log(`TTS tier=${chosen.tier} model=${chosen.model} voice=${chosen.voice} (input $${(Number(entry.pricing.prompt) * 1e6).toFixed(2)}/1M units)`);
const outDir = path.join("public", slug);
await mkdir(outDir, { recursive: true });

const generatedPath = path.join("src", slug, "voiceover.generated.json");
const previous = await readFile(generatedPath, "utf8").then(JSON.parse, () => ({ lines: {} }));
const lines = { ...previous.lines };

for (const line of spec.lines) {
  if (args.only && args.only !== line.id) continue;
  const res = await orFetch("/audio/speech", {
    method: "POST",
    body: JSON.stringify({
      model: chosen.model,
      voice: chosen.voice,
      input: line.text,
      response_format: "mp3",
      ...(spec.instructions ? { instructions: spec.instructions } : {}),
      ...(spec.speed ? { speed: spec.speed } : {}),
    }),
  });
  const file = path.join(outDir, `vo-${line.id}.mp3`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  const { durationInSeconds } = await parseMedia({
    src: file,
    reader: nodeReader,
    fields: { durationInSeconds: true },
    acknowledgeRemotionLicense: true,
  });
  lines[line.id] = {
    file: `${slug}/vo-${line.id}.mp3`,
    durationInSeconds,
    generationId: res.headers.get("x-generation-id"),
  };
  console.log(`${line.id}: ${durationInSeconds?.toFixed(2)}s -> ${file}`);
}

await writeFile(
  generatedPath,
  JSON.stringify({ model: chosen.model, voice: chosen.voice, lines }, null, 2) + "\n",
);
