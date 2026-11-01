// Publish a video as a Reel on a Facebook Page. It is public, so it only prints a preview unless --yes is passed.
//   node --env-file=../.env scripts/fbpost.mjs --file ../out/<slug>-reels.mp4 --caption "..." [--page <page-id>] [--draft] [--yes]
//   node --env-file=../.env scripts/fbpost.mjs --file ../out/<slug>-reels.mp4 --caption-file ../briefs/caption.txt
// Needs GRAPH_API_TOKEN (EAA... user token with pages_show_list, pages_read_engagement, pages_manage_posts) in .env.
// The Page token is read from /me/accounts and kept in memory only; nothing secret is printed or written.
// --draft saves the Reel as a draft instead of publishing it. Without --page the Page must be the only one the token can manage.
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "./openrouter.mjs";

const GRAPH = "https://graph.facebook.com/v21.0";
const args = parseArgs(process.argv.slice(2));

const userToken = process.env.GRAPH_API_TOKEN;
if (!userToken) throw new Error("GRAPH_API_TOKEN is missing in .env");
if (!args.file || args.file === true) throw new Error("Missing --file");
const caption = args["caption-file"] ? (await readFile(args["caption-file"], "utf8")).trim() : args.caption;
if (!caption || caption === true) throw new Error("Missing --caption or --caption-file");

const graph = async (url, init = {}) => {
  const res = await fetch(url, init);
  const json = await res.json();
  if (json.error) throw new Error(`Graph API: ${json.error.message} (code ${json.error.code})`);
  return json;
};

const accounts = (await graph(`${GRAPH}/me/accounts?fields=id,name,access_token,tasks`, {
  headers: { Authorization: `Bearer ${userToken}` },
})).data;
const page = args.page && args.page !== true ? accounts.find((a) => a.id === args.page) : accounts.length === 1 ? accounts[0] : undefined;
if (!page) {
  throw new Error(`Pick a Page with --page. Available: ${accounts.map((a) => `${a.id} (${a.name})`).join(", ") || "none"}`);
}
if (!page.tasks?.includes("CREATE_CONTENT")) throw new Error(`This token cannot create content on ${page.name}`);

const size = (await stat(args.file)).size;
const state = args.draft ? "DRAFT" : "PUBLISHED";
console.log(`Page:    ${page.name} (${page.id})`);
console.log(`File:    ${path.resolve(args.file)} (${(size / 1024 ** 2).toFixed(1)} MB)`);
console.log(`State:   ${state}`);
console.log(`Caption: ${caption}`);

if (!args.yes) {
  console.log("\nPreview only. Add --yes to upload.");
  process.exit(0);
}

const pageAuth = { Authorization: `Bearer ${page.access_token}` };
const reels = `${GRAPH}/${page.id}/video_reels`;
const form = (fields) => new URLSearchParams(fields);

// 1. Start an upload session.
const { video_id: videoId, upload_url: uploadUrl } = await graph(reels, {
  method: "POST",
  headers: pageAuth,
  body: form({ upload_phase: "start" }),
});
console.log(`Upload session started, video_id=${videoId}`);

// 2. Send the bytes.
const upload = await graph(uploadUrl, {
  method: "POST",
  headers: { Authorization: `OAuth ${page.access_token}`, offset: "0", file_size: String(size) },
  body: await readFile(args.file),
});
if (!upload.success) throw new Error(`Upload failed: ${JSON.stringify(upload)}`);

// 3. Finish: this is the step that makes the Reel public (or saves the draft).
await graph(reels, {
  method: "POST",
  headers: pageAuth,
  body: form({ upload_phase: "finish", video_id: videoId, video_state: state, description: caption }),
});

// 4. Check processing status.
for (let i = 0; i < 12; i++) {
  const { status } = await graph(`${GRAPH}/${videoId}?fields=status`, { headers: pageAuth });
  console.log(`Status: ${status?.video_status ?? "unknown"}`);
  if (["ready", "error"].includes(status?.video_status)) break;
  await new Promise((r) => setTimeout(r, 5000));
}
console.log(`Done. https://www.facebook.com/${page.id}/videos/${videoId}`);
