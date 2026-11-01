// Generate still images through OpenRouter. Costs money, so it only prints the plan unless --yes is passed.
//   node --env-file=../.env scripts/genimage.mjs <slug> [--tier cheap|standard|premium] [--model id] [--only <id>] [--yes]
// Reads  src/<slug>/images.json  { tier?, model?, aspect_ratio?, resolution?, images: [{ id, prompt }] }
// Writes public/<slug>/art-<id>.<ext> and src/<slug>/images.generated.json (model, cost per image).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { imageCatalog, resolveModel } from "./models.mjs";
import { orFetch, parseArgs } from "./openrouter.mjs";

const args = parseArgs(process.argv.slice(2));
const slug = args._[0];
if (!slug) throw new Error("Usage: genimage.mjs <slug> [--tier t] [--model id] [--only <id>] [--yes]");

const specPath = path.join("src", slug, "images.json");
const spec = JSON.parse(await readFile(specPath, "utf8"));
const chosen = resolveModel("image", { args, spec });
const entry = (await imageCatalog()).find((m) => m.id === chosen.model);
if (!entry) throw new Error(`Model ${chosen.model} is not in the OpenRouter image catalog`);

const todo = spec.images.filter((i) => !args.only || i.id === args.only);
console.log(`Image tier=${chosen.tier} model=${chosen.model} aspect=${spec.aspect_ratio ?? "default"} count=${todo.length}`);
console.log(`Pricing: ${JSON.stringify(entry.pricing)}`);
if (!args.yes) {
  for (const i of todo) console.log(`  ${i.id}: ${i.prompt}`);
  console.log("Dry run (add --yes to generate).");
  process.exit(0);
}

const outDir = path.join("public", slug);
await mkdir(outDir, { recursive: true });
const generatedPath = path.join("src", slug, "images.generated.json");
const previous = await readFile(generatedPath, "utf8").then(JSON.parse, () => ({ images: {} }));
const images = { ...previous.images };

for (const img of todo) {
  const res = await (
    await orFetch("/images", {
      method: "POST",
      body: JSON.stringify({
        model: chosen.model,
        prompt: img.prompt,
        n: 1,
        ...(spec.aspect_ratio ? { aspect_ratio: spec.aspect_ratio } : {}),
        ...(spec.resolution ? { resolution: spec.resolution } : {}),
      }),
    })
  ).json();
  const first = res.data?.[0];
  if (!first?.b64_json) throw new Error(`No image returned for ${img.id}: ${JSON.stringify(res).slice(0, 300)}`);
  const ext = (first.media_type ?? "image/png").split("/")[1].replace("jpeg", "jpg");
  const file = path.join(outDir, `art-${img.id}.${ext}`);
  await writeFile(file, Buffer.from(first.b64_json, "base64"));
  images[img.id] = { file: `${slug}/art-${img.id}.${ext}`, model: chosen.model, cost: res.usage?.cost ?? null };
  console.log(`${img.id}: saved ${file}  cost=$${res.usage?.cost ?? "?"}`);
}

await writeFile(generatedPath, JSON.stringify({ images }, null, 2) + "\n");
