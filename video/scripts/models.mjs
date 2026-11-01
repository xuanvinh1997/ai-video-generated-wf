// Model selection shared by the generation scripts. Tiers live in models.json; the default is "cheap".
// Precedence (highest first): --model/--voice flags, fields in the spec file, --tier flag, spec "tier", models.json default.
//   node --env-file=../.env scripts/models.mjs            list every tier with live prices
//   node --env-file=../.env scripts/models.mjs tts        list one kind
import { readFile } from "node:fs/promises";
import { orFetch } from "./openrouter.mjs";

const config = JSON.parse(await readFile(new URL("./models.json", import.meta.url), "utf8"));

export const tierNames = (kind) => Object.keys(config[kind] ?? {});

// Returns { tier, model, voice?, resolution? } for a kind ("tts" | "video").
export const resolveModel = (kind, { args = {}, spec = {} } = {}) => {
  const tier = args.tier ?? spec.tier ?? config.default;
  const base = config[kind]?.[tier];
  if (!base) {
    throw new Error(`Unknown tier "${tier}" for ${kind}. Available: ${tierNames(kind).join(", ")}`);
  }
  const model = args.model ?? spec.model ?? base.model;
  const sameModel = model === base.model;
  return {
    ...(sameModel ? base : { model }),
    ...(spec.voice ? { voice: spec.voice } : {}),
    ...(args.voice ? { voice: args.voice } : {}),
    tier: sameModel ? tier : "custom",
  };
};

export const speechCatalog = async () =>
  (await (await orFetch("/models?output_modalities=speech")).json()).data;

export const imageCatalog = async () =>
  (await (await orFetch("/models?output_modalities=image")).json()).data;

export const videoCatalog =async () => (await (await orFetch("/videos/models")).json()).data;

if (import.meta.url === `file://${process.argv[1]}`) {
  const only = process.argv[2];
  const [speech, image, video] = await Promise.all([speechCatalog(), imageCatalog(), videoCatalog()]);
  const show = (kind, catalog, price) => {
    console.log(`\n${kind} (default tier: ${config.default})`);
    for (const tier of tierNames(kind)) {
      const entry = config[kind][tier];
      const m = catalog.find((x) => x.id === entry.model);
      console.log(`  ${tier.padEnd(9)} ${entry.model}  ${m ? price(m) : "NOT IN CATALOG"}`);
    }
  };
  if (!only || only === "tts") {
    show("tts", speech, (m) => `input $${(Number(m.pricing.prompt) * 1e6).toFixed(2)}/1M units, output $${(Number(m.pricing.completion) * 1e6).toFixed(2)}/1M`);
  }
  if (!only || only === "image") {
    show("image", image, (m) => `image output $${(Number(m.pricing.image_output) * 1e6).toFixed(2)}/1M tokens, flat/image $${m.pricing.image ?? "0"}`);
  }
  if (!only || only === "video") {
    show("video", video, (m) => JSON.stringify(m.pricing_skus));
  }
}
