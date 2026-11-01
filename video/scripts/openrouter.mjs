// Shared OpenRouter helpers. Run scripts with: node --env-file=../.env scripts/<name>.mjs
const BASE = "https://openrouter.ai/api/v1";

const apiKey = () => {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY missing. Run with: node --env-file=../.env scripts/<name>.mjs");
  }
  return key;
};

export const orFetch = async (path, init = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`OpenRouter ${path} -> ${res.status}: ${(await res.text()).slice(0, 500)}`);
  }
  return res;
};

export const parseArgs = (argv) => {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[a.slice(2)] = true;
    else {
      out[a.slice(2)] = next;
      i++;
    }
  }
  return out;
};
