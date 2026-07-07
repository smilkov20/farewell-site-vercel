export const dynamic = "force-dynamic";

const REPO = process.env.GITHUB_REPO; // e.g. "your-username/your-repo"
const TOKEN = process.env.GITHUB_TOKEN;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const FILE_PATH = "data/wishes.json";

const API = () =>
  `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;

const headers = () => ({
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

async function readFile() {
  const res = await fetch(API(), { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const data = await res.json();
  const wishes = JSON.parse(Buffer.from(data.content, "base64").toString("utf8"));
  return { wishes: Array.isArray(wishes) ? wishes : [], sha: data.sha };
}

export async function GET() {
  try {
    if (!REPO || !TOKEN) throw new Error("Missing GITHUB_REPO or GITHUB_TOKEN");
    const { wishes } = await readFile();
    wishes.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    return Response.json({ wishes });
  } catch (err) {
    console.error("GET /api/wishes:", err.message);
    return Response.json({ wishes: [], error: err.message }, { status: 200 });
  }
}

export async function POST(request) {
  try {
    if (!REPO || !TOKEN) throw new Error("Missing GITHUB_REPO or GITHUB_TOKEN");
    const { name, message } = await request.json();
    if (
      typeof name !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !message.trim() ||
      name.length > 80 ||
      message.length > 2000
    ) {
      return Response.json({ error: "invalid_input" }, { status: 400 });
    }
    const wish = { name: name.trim(), message: message.trim(), createdAt: Date.now() };

    // Retry a few times in case two people submit at the same moment
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { wishes, sha } = await readFile();
        wishes.push(wish);
        const res = await fetch(API(), {
          method: "PUT",
          headers: { ...headers(), "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Add wish from ${wish.name} [skip ci]`,
            content: Buffer.from(JSON.stringify(wishes, null, 2)).toString("base64"),
            sha,
            branch: BRANCH,
          }),
        });
        if (res.ok) return Response.json({ ok: true });
        if (res.status === 409) { lastErr = new Error("conflict"); continue; }
        const body = await res.text();
        throw new Error(`GitHub write failed: ${res.status} ${body.slice(0, 200)}`);
      } catch (e) {
        lastErr = e;
        if (e.message !== "conflict") break;
      }
    }
    throw lastErr || new Error("unknown");
  } catch (err) {
    console.error("POST /api/wishes:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
