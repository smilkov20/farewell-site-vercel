import { list, put } from "@vercel/blob";

export const dynamic = "force-dynamic";

const PREFIX = "wishes/";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: PREFIX });
    const wishes = await Promise.all(
      blobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: "no-store" });
          return await res.json();
        } catch {
          return null;
        }
      })
    );
    const valid = wishes
      .filter(Boolean)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    return Response.json({ wishes: valid });
  } catch (err) {
    return Response.json({ wishes: [], error: "storage_unavailable" }, { status: 200 });
  }
}

export async function POST(request) {
  try {
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
    const wish = {
      name: name.trim(),
      message: message.trim(),
      createdAt: Date.now(),
    };
    const key = `${PREFIX}${wish.createdAt}-${Math.random().toString(36).slice(2, 8)}.json`;
    await put(key, JSON.stringify(wish), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
