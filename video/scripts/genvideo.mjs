// Generate a clip through OpenRouter. Costs money, so it only prints the estimate unless --yes is passed.
//   node --env-file=../.env scripts/genvideo.mjs models          every model OpenRouter offers
//   node --env-file=../.env scripts/models.mjs video              the tiers configured in models.json
//   node --env-file=../.env scripts/genvideo.mjs --prompt "..." --duration 4 --aspect 9:16 \
//     [--tier cheap|standard|premium | --model id] [--resolution 720p] [--audio] [--image first.png] --out public/x/clip.mp4 [--yes]
// The default tier is "cheap" (see scripts/models.json).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveModel, videoCatalog } from "./models.mjs";
import { orFetch, parseArgs } from "./openrouter.mjs";

const args = parseArgs(process.argv.slice(2));

if (args._[0] === "models") {
  const data = await videoCatalog();
  for (const m of data) {
    console.log(
      `${m.id}  dur=${m.supported_durations?.join(",") ?? "-"}  res=${m.supported_resolutions?.join(",") ?? "-"}  ar=${m.supported_aspect_ratios?.join(",") ?? "-"}  frames=${m.supported_frame_images?.join(",") ?? "-"}  audio=${m.generate_audio}`,
    );
  }
  process.exit(0);
}

for (const k of ["prompt", "out"]) {
  if (!args[k] || args[k] === true) throw new Error(`Missing --${k}`);
}

const chosen = resolveModel("video", { args });
const resolution = args.resolution ?? chosen.resolution;
const catalogEntry = (await videoCatalog()).find((x) => x.id === chosen.model);
if (!catalogEntry) throw new Error(`Model ${chosen.model} is not in the OpenRouter video catalog`);

const check = (label, value, allowed) => {
  if (value !== undefined && allowed && !allowed.map(String).includes(String(value))) {
    throw new Error(`${chosen.model} does not support ${label} ${value}. Options: ${allowed.join(", ")}`);
  }
};
check("duration", args.duration, catalogEntry.supported_durations);
check("resolution", resolution, catalogEntry.supported_resolutions);
check("aspect ratio", args.aspect, catalogEntry.supported_aspect_ratios);
if (args.audio && catalogEntry.generate_audio === false) {
  throw new Error(`${chosen.model} cannot generate audio`);
}
console.log(`Video tier=${chosen.tier} model=${chosen.model} resolution=${resolution ?? "default"}`);

const body = {
  model: chosen.model,
  prompt: args.prompt,
  ...(args.duration ? { duration: Number(args.duration) } : {}),
  ...(resolution ? { resolution } : {}),
  ...(args.aspect ? { aspect_ratio: args.aspect } : {}),
  generate_audio: Boolean(args.audio),
};

if (args.image) {
  const ext = path.extname(args.image).slice(1).toLowerCase().replace("jpg", "jpeg");
  const b64 = (await readFile(args.image)).toString("base64");
  body.frame_images = [
    {
      type: "image_url",
      image_url: { url: `data:image/${ext};base64,${b64}` },
      frame_type: "first_frame",
    },
  ];
}

if (!args.yes) {
  console.log("Dry run (add --yes to submit). Request:", { ...body, frame_images: body.frame_images ? "[image]" : undefined });
  console.log("Pricing:", JSON.stringify(catalogEntry.pricing_skus));
  process.exit(0);
}

const submit = await (await orFetch("/videos", { method: "POST", body: JSON.stringify(body) })).json();
console.log(`job ${submit.id} (${submit.status})`);

let job = submit;
while (!["completed", "failed", "cancelled", "expired"].includes(job.status)) {
  await new Promise((r) => setTimeout(r, 15000));
  job = await (await orFetch(`/videos/${submit.id}`)).json();
  console.log(`  ${job.status}`);
}
if (job.status !== "completed") throw new Error(`Job ${job.status}: ${JSON.stringify(job)}`);

const res = await orFetch(`/videos/${submit.id}/content?index=0`);
await mkdir(path.dirname(args.out), { recursive: true });
await writeFile(args.out, Buffer.from(await res.arrayBuffer()));
console.log(`saved ${args.out}  cost=$${job.usage?.cost ?? "?"}`);
